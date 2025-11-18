import { DatabaseService } from '@app/database';
import { LoggerService } from '@app/logging';
import { EventBusService, EVENTS } from '@app/messaging';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Tenant } from '@prisma/client';
import {
  CreateTenantDto,
  SubscriptionPlan,
  TenantStatus,
  UpdateSubscriptionDto,
  UpdateTenantDto,
  UpdateTenantSettingsDto,
} from '../dto/tenant.dto';

@Injectable()
export class TenantService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly logger: LoggerService,
    private readonly eventBus: EventBusService,
  ) {}

  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    const { slug, name, ...data } = createTenantDto;

    // Check if slug already exists
    const existingTenant = await this.prisma.tenant.findUnique({
      where: { slug },
    });

    if (existingTenant) {
      throw new ConflictException(`Tenant with slug '${slug}' already exists`);
    }

    // Create tenant with default values
    const tenant = await this.prisma.tenant.create({
      data: {
        name,
        slug,
        status: TenantStatus.TRIAL,
        subscriptionPlan: data.subscriptionPlan || SubscriptionPlan.TRIAL,
        maxUsers: data.maxUsers || 10,
        description: data.description,
        website: data.website,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        settings: data.settings || {},
        subscriptionStartDate: new Date(),
        subscriptionEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
      },
    });

    // Emit tenant created event
    await this.eventBus.publish(EVENTS.TENANT_CREATED, {
      tenantId: tenant.id,
      tenantName: tenant.name,
      slug: tenant.slug,
    });

    this.logger.log(`Tenant created: ${tenant.name} (${tenant.id})`, 'TenantService');

    return tenant;
  }

  async findAll(page: number = 1, limit: number = 20, status?: TenantStatus) {
    const skip = (page - 1) * limit;

    const where = status ? { status } : {};

    const [tenants, total] = await Promise.all([
      this.prisma.tenant.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          slug: true,
          status: true,
          subscriptionPlan: true,
          maxUsers: true,
          contactEmail: true,
          website: true,
          createdAt: true,
          subscriptionEndDate: true,
          _count: {
            select: {
              users: true,
              courses: true,
            },
          },
        },
      }),
      this.prisma.tenant.count({ where }),
    ]);

    return {
      data: tenants.map((tenant) => ({
        ...tenant,
        userCount: tenant._count.users,
        courseCount: tenant._count.courses,
        _count: undefined,
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Tenant> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
            courses: true,
            enrollments: true,
          },
        },
      },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID '${id}' not found`);
    }

    return tenant;
  }

  async findBySlug(slug: string): Promise<Tenant> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with slug '${slug}' not found`);
    }

    return tenant;
  }

  async update(id: string, updateTenantDto: UpdateTenantDto): Promise<Tenant> {
    // Check if tenant exists
    await this.findOne(id);

    const tenant = await this.prisma.tenant.update({
      where: { id },
      data: updateTenantDto,
    });

    // Emit tenant updated event
    await this.eventBus.publish(EVENTS.TENANT_UPDATED, {
      tenantId: tenant.id,
      tenantName: tenant.name,
      changes: Object.keys(updateTenantDto),
    });

    this.logger.log(`Tenant updated: ${tenant.name} (${id})`, 'TenantService');

    return tenant;
  }

  async updateSettings(id: string, updateSettingsDto: UpdateTenantSettingsDto): Promise<Tenant> {
    await this.findOne(id);

    const tenant = await this.prisma.tenant.update({
      where: { id },
      data: {
        settings: updateSettingsDto.settings,
      },
    });

    this.logger.log(`Tenant settings updated: ${id}`, 'TenantService');

    return tenant;
  }

  async updateSubscription(
    id: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<Tenant> {
    const tenant = await this.findOne(id);

    // Validate plan change
    const planHierarchy = {
      [SubscriptionPlan.FREE]: 0,
      [SubscriptionPlan.STARTER]: 1,
      [SubscriptionPlan.PROFESSIONAL]: 2,
      [SubscriptionPlan.ENTERPRISE]: 3,
    };

    const currentPlanLevel = planHierarchy[tenant.subscriptionPlan as SubscriptionPlan];
    const newPlanLevel = planHierarchy[updateSubscriptionDto.plan];

    // Check if downgrade would exceed limits
    if (newPlanLevel < currentPlanLevel) {
      const userCount = await this.prisma.user.count({
        where: { tenantId: id },
      });

      const newMaxUsers = this.getMaxUsersForPlan(updateSubscriptionDto.plan);
      if (userCount > newMaxUsers) {
        throw new BadRequestException(
          `Cannot downgrade: Current user count (${userCount}) exceeds plan limit (${newMaxUsers})`,
        );
      }
    }

    // Calculate new subscription end date
    let subscriptionEndDate: Date;
    if (updateSubscriptionDto.plan === SubscriptionPlan.TRIAL) {
      subscriptionEndDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    } else {
      subscriptionEndDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year
    }

    const updatedTenant = await this.prisma.tenant.update({
      where: { id },
      data: {
        subscriptionPlan: updateSubscriptionDto.plan,
        maxUsers:
          updateSubscriptionDto.maxUsers || this.getMaxUsersForPlan(updateSubscriptionDto.plan),
        subscriptionStartDate: new Date(),
        subscriptionEndDate,
        status: TenantStatus.ACTIVE,
      },
    });

    // Emit subscription updated event
    await this.eventBus.publish(EVENTS.SUBSCRIPTION_UPDATED, {
      tenantId: id,
      oldPlan: tenant.subscriptionPlan,
      newPlan: updateSubscriptionDto.plan,
      autoRenew: updateSubscriptionDto.autoRenew,
    });

    this.logger.log(
      `Subscription updated for tenant ${id}: ${tenant.subscriptionPlan} -> ${updateSubscriptionDto.plan}`,
      'TenantService',
    );

    return updatedTenant;
  }

  async suspend(id: string, reason?: string): Promise<Tenant> {
    await this.findOne(id);

    const tenant = await this.prisma.tenant.update({
      where: { id },
      data: {
        status: TenantStatus.SUSPENDED,
      },
    });

    // Emit tenant suspended event
    await this.eventBus.publish(EVENTS.TENANT_SUSPENDED, {
      tenantId: id,
      reason,
    });

    this.logger.warn(`Tenant suspended: ${id}. Reason: ${reason}`, 'TenantService');

    return tenant;
  }

  async activate(id: string): Promise<Tenant> {
    await this.findOne(id);

    const tenant = await this.prisma.tenant.update({
      where: { id },
      data: {
        status: TenantStatus.ACTIVE,
      },
    });

    // Emit tenant activated event
    await this.eventBus.publish(EVENTS.TENANT_ACTIVATED, {
      tenantId: id,
    });

    this.logger.log(`Tenant activated: ${id}`, 'TenantService');

    return tenant;
  }

  async delete(id: string): Promise<void> {
    await this.findOne(id);

    // Check if tenant has users
    const userCount = await this.prisma.user.count({
      where: { tenantId: id },
    });

    if (userCount > 0) {
      throw new BadRequestException(
        `Cannot delete tenant with ${userCount} users. Remove all users first.`,
      );
    }

    await this.prisma.tenant.delete({
      where: { id },
    });

    // Emit tenant deleted event
    await this.eventBus.publish(EVENTS.TENANT_DELETED, {
      tenantId: id,
    });

    this.logger.log(`Tenant deleted: ${id}`, 'TenantService');
  }

  async getStats(id: string) {
    await this.findOne(id);

    const [userCount, activeUserCount, courseCount, enrollmentCount] = await Promise.all([
      this.prisma.user.count({ where: { tenantId: id } }),
      this.prisma.user.count({ where: { tenantId: id, lastLoginAt: { not: null } } }),
      this.prisma.course.count({ where: { tenantId: id } }),
      this.prisma.enrollment.count({ where: { userId: { in: await this.getTenantUserIds(id) } } }),
    ]);

    // Calculate storage usage (placeholder - would integrate with MinIO)
    const storageUsed = 0;
    const tenant = await this.prisma.tenant.findUnique({ where: { id } });
    const storageLimit = this.getStorageLimitForPlan(tenant.subscriptionPlan as SubscriptionPlan);

    return {
      totalUsers: userCount,
      activeUsers: activeUserCount,
      totalCourses: courseCount,
      totalEnrollments: enrollmentCount,
      storageUsed,
      storageLimit,
    };
  }

  async checkExpiredSubscriptions() {
    const expiredTenants = await this.prisma.tenant.findMany({
      where: {
        subscriptionEndDate: {
          lt: new Date(),
        },
        status: {
          not: TenantStatus.EXPIRED,
        },
      },
    });

    for (const tenant of expiredTenants) {
      await this.prisma.tenant.update({
        where: { id: tenant.id },
        data: { status: TenantStatus.EXPIRED },
      });

      await this.eventBus.publish(EVENTS.SUBSCRIPTION_EXPIRED, {
        tenantId: tenant.id,
        tenantName: tenant.name,
      });

      this.logger.warn(
        `Subscription expired for tenant: ${tenant.name} (${tenant.id})`,
        'TenantService',
      );
    }

    return expiredTenants.length;
  }

  async getUpcomingExpirations(days: number = 7) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return this.prisma.tenant.findMany({
      where: {
        subscriptionEndDate: {
          gte: new Date(),
          lte: futureDate,
        },
        status: TenantStatus.ACTIVE,
      },
      select: {
        id: true,
        name: true,
        contactEmail: true,
        subscriptionEndDate: true,
        subscriptionPlan: true,
      },
    });
  }

  private async getTenantUserIds(tenantId: string): Promise<string[]> {
    const users = await this.prisma.user.findMany({
      where: { tenantId },
      select: { id: true },
    });
    return users.map((u) => u.id);
  }

  private getMaxUsersForPlan(plan: SubscriptionPlan): number {
    const limits = {
      [SubscriptionPlan.FREE]: 5,
      [SubscriptionPlan.TRIAL]: 10,
      [SubscriptionPlan.STARTER]: 50,
      [SubscriptionPlan.PROFESSIONAL]: 200,
      [SubscriptionPlan.ENTERPRISE]: 10000,
    };
    return limits[plan];
  }

  private getStorageLimitForPlan(plan: SubscriptionPlan): number {
    // Storage limits in MB
    const limits = {
      [SubscriptionPlan.FREE]: 100,
      [SubscriptionPlan.TRIAL]: 500,
      [SubscriptionPlan.STARTER]: 5000,
      [SubscriptionPlan.PROFESSIONAL]: 50000,
      [SubscriptionPlan.ENTERPRISE]: 500000,
    };
    return limits[plan];
  }
}
