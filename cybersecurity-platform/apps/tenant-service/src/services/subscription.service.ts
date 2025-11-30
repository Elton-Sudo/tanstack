import { DatabaseService } from '@app/database';
import { LoggerService } from '@app/logging';
import { EventBusService, EVENTS } from '@app/messaging';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CalculateOverageDto,
  DowngradeSubscriptionDto,
  OverageCalculation,
  PlanLimits,
  PlanPricing,
  SubscriptionPlan,
  UpgradeSubscriptionDto,
  UsageDto,
} from '../dto/subscription.dto';

export interface FeatureAccess {
  // Core Features
  aiAssessments: boolean;
  customCourses: boolean;
  advancedReporting: boolean;
  apiAccess: boolean;
  ssoIntegration: boolean;
  whiteLabeling: boolean;
  customRoles: boolean;
  gamification: boolean;

  // Advanced Features
  bulkOperations: boolean;
  dataExport: boolean;
  webhooks: boolean;
  auditLogs: boolean;
  prioritySupport: boolean;
  dedicatedAccountManager: boolean;
  customIntegrations: boolean;
  advancedAnalytics: boolean;
}

@Injectable()
export class SubscriptionService {
  private readonly planLimits: Record<SubscriptionPlan, PlanLimits> = {
    [SubscriptionPlan.TRIAL]: {
      users: 10,
      storage: 1, // GB
      apiCalls: 1000,
    },
    [SubscriptionPlan.FREE]: {
      users: 5,
      storage: 0.5, // GB
      apiCalls: 500,
    },
    [SubscriptionPlan.STARTER]: {
      users: 50,
      storage: 10, // GB
      apiCalls: 10000,
    },
    [SubscriptionPlan.PROFESSIONAL]: {
      users: 200,
      storage: 100, // GB
      apiCalls: 100000,
    },
    [SubscriptionPlan.ENTERPRISE]: {
      users: -1, // unlimited
      storage: -1, // unlimited
      apiCalls: -1, // unlimited
    },
  };

  private readonly planPricing: Record<SubscriptionPlan, PlanPricing> = {
    [SubscriptionPlan.TRIAL]: {
      basePrice: 0,
      currency: 'ZAR',
      overageRates: { perUser: 0, perGB: 0, perApiCall: 0 },
    },
    [SubscriptionPlan.FREE]: {
      basePrice: 0,
      currency: 'ZAR',
      overageRates: { perUser: 0, perGB: 0, perApiCall: 0 },
    },
    [SubscriptionPlan.STARTER]: {
      basePrice: 499,
      currency: 'ZAR',
      overageRates: { perUser: 10, perGB: 5, perApiCall: 0.001 },
    },
    [SubscriptionPlan.PROFESSIONAL]: {
      basePrice: 1999,
      currency: 'ZAR',
      overageRates: { perUser: 8, perGB: 3, perApiCall: 0.0005 },
    },
    [SubscriptionPlan.ENTERPRISE]: {
      basePrice: 9999,
      currency: 'ZAR',
      overageRates: { perUser: 0, perGB: 0, perApiCall: 0 },
    },
  };

  private readonly featureMatrix: Record<SubscriptionPlan, FeatureAccess> = {
    [SubscriptionPlan.TRIAL]: {
      aiAssessments: true,
      customCourses: false,
      advancedReporting: false,
      apiAccess: false,
      ssoIntegration: false,
      whiteLabeling: false,
      customRoles: false,
      gamification: true,
      bulkOperations: false,
      dataExport: false,
      webhooks: false,
      auditLogs: false,
      prioritySupport: false,
      dedicatedAccountManager: false,
      customIntegrations: false,
      advancedAnalytics: false,
    },
    [SubscriptionPlan.FREE]: {
      aiAssessments: false,
      customCourses: false,
      advancedReporting: false,
      apiAccess: false,
      ssoIntegration: false,
      whiteLabeling: false,
      customRoles: false,
      gamification: false,
      bulkOperations: false,
      dataExport: false,
      webhooks: false,
      auditLogs: false,
      prioritySupport: false,
      dedicatedAccountManager: false,
      customIntegrations: false,
      advancedAnalytics: false,
    },
    [SubscriptionPlan.STARTER]: {
      aiAssessments: true,
      customCourses: true,
      advancedReporting: false,
      apiAccess: true,
      ssoIntegration: false,
      whiteLabeling: false,
      customRoles: false,
      gamification: true,
      bulkOperations: false,
      dataExport: true,
      webhooks: false,
      auditLogs: false,
      prioritySupport: false,
      dedicatedAccountManager: false,
      customIntegrations: false,
      advancedAnalytics: false,
    },
    [SubscriptionPlan.PROFESSIONAL]: {
      aiAssessments: true,
      customCourses: true,
      advancedReporting: true,
      apiAccess: true,
      ssoIntegration: true,
      whiteLabeling: true,
      customRoles: true,
      gamification: true,
      bulkOperations: true,
      dataExport: true,
      webhooks: true,
      auditLogs: true,
      prioritySupport: true,
      dedicatedAccountManager: false,
      customIntegrations: false,
      advancedAnalytics: true,
    },
    [SubscriptionPlan.ENTERPRISE]: {
      aiAssessments: true,
      customCourses: true,
      advancedReporting: true,
      apiAccess: true,
      ssoIntegration: true,
      whiteLabeling: true,
      customRoles: true,
      gamification: true,
      bulkOperations: true,
      dataExport: true,
      webhooks: true,
      auditLogs: true,
      prioritySupport: true,
      dedicatedAccountManager: true,
      customIntegrations: true,
      advancedAnalytics: true,
    },
  };

  private readonly planHierarchy: Record<SubscriptionPlan, number> = {
    [SubscriptionPlan.FREE]: 0,
    [SubscriptionPlan.TRIAL]: 1,
    [SubscriptionPlan.STARTER]: 2,
    [SubscriptionPlan.PROFESSIONAL]: 3,
    [SubscriptionPlan.ENTERPRISE]: 4,
  };

  constructor(
    private readonly prisma: DatabaseService,
    private readonly logger: LoggerService,
    private readonly eventBus: EventBusService,
  ) {}

  /**
   * Get plan limits for a specific subscription tier
   */
  getPlanLimits(plan: SubscriptionPlan): PlanLimits {
    return this.planLimits[plan];
  }

  /**
   * Get pricing information for a specific plan
   */
  getPlanPricing(plan: SubscriptionPlan): PlanPricing {
    return this.planPricing[plan];
  }

  /**
   * Get feature access matrix for a specific plan
   */
  getFeatureAccess(plan: SubscriptionPlan): FeatureAccess {
    return this.featureMatrix[plan];
  }

  /**
   * Check if a tenant has access to a specific feature
   */
  async hasFeatureAccess(tenantId: string, feature: keyof FeatureAccess): Promise<boolean> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { subscriptionPlan: true },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant ${tenantId} not found`);
    }

    const plan = tenant.subscriptionPlan as SubscriptionPlan;
    const features = this.featureMatrix[plan];

    return features[feature] || false;
  }

  /**
   * Validate if a tenant can perform an action based on feature access
   */
  async validateFeatureAccess(
    tenantId: string,
    feature: keyof FeatureAccess,
    throwOnDenied: boolean = true,
  ): Promise<boolean> {
    const hasAccess = await this.hasFeatureAccess(tenantId, feature);

    if (!hasAccess && throwOnDenied) {
      const tenant = await this.prisma.tenant.findUnique({
        where: { id: tenantId },
        select: { subscriptionPlan: true },
      });

      throw new ForbiddenException(
        `Feature '${feature}' is not available in your current plan (${tenant?.subscriptionPlan}). Please upgrade to access this feature.`,
      );
    }

    return hasAccess;
  }

  /**
   * Check if tenant is within usage limits
   */
  async checkUsageLimits(tenantId: string): Promise<{
    withinLimits: boolean;
    violations: string[];
    usage: UsageDto;
    limits: PlanLimits;
  }> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { subscriptionPlan: true },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant ${tenantId} not found`);
    }

    const plan = tenant.subscriptionPlan as SubscriptionPlan;
    const limits = this.planLimits[plan];

    // Get current usage
    const userCount = await this.prisma.user.count({ where: { tenantId } });

    // TODO: Integrate with actual storage tracking (MinIO)
    const storageGB = 0;

    // Get API calls for current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const apiCallsResult = await this.prisma.usageEvent.aggregate({
      where: {
        tenantId,
        metricType: 'API_CALL',
        createdAt: { gte: startOfMonth },
      },
      _sum: {
        metricValue: true,
      },
    });

    const apiCallsCount = apiCallsResult._sum.metricValue || 0;

    const usage: UsageDto = {
      activeUsers: userCount,
      storageGB,
      apiCalls: apiCallsCount,
    };

    const violations: string[] = [];

    // Check user limit
    if (limits.users !== -1 && userCount > limits.users) {
      violations.push(`User limit exceeded: ${userCount}/${limits.users}`);
    }

    // Check storage limit
    if (limits.storage !== -1 && storageGB > limits.storage) {
      violations.push(`Storage limit exceeded: ${storageGB}GB/${limits.storage}GB`);
    }

    // Check API calls limit
    if (limits.apiCalls !== -1 && apiCallsCount > limits.apiCalls) {
      violations.push(`API calls limit exceeded: ${apiCallsCount}/${limits.apiCalls}`);
    }

    return {
      withinLimits: violations.length === 0,
      violations,
      usage,
      limits,
    };
  }

  /**
   * Validate if a tenant can add more users
   */
  async canAddUsers(tenantId: string, additionalUsers: number = 1): Promise<boolean> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { subscriptionPlan: true },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant ${tenantId} not found`);
    }

    const plan = tenant.subscriptionPlan as SubscriptionPlan;
    const limits = this.planLimits[plan];

    // Unlimited users
    if (limits.users === -1) {
      return true;
    }

    const currentUserCount = await this.prisma.user.count({ where: { tenantId } });
    return currentUserCount + additionalUsers <= limits.users;
  }

  /**
   * Upgrade tenant subscription
   */
  async upgradeSubscription(tenantId: string, upgradeDto: UpgradeSubscriptionDto): Promise<void> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { subscriptionPlan: true, name: true },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant ${tenantId} not found`);
    }

    const currentPlan = tenant.subscriptionPlan as SubscriptionPlan;
    const newPlan = upgradeDto.newPlan;

    // Validate it's actually an upgrade
    if (this.planHierarchy[newPlan] <= this.planHierarchy[currentPlan]) {
      throw new BadRequestException(
        `Cannot upgrade from ${currentPlan} to ${newPlan}. Use downgrade endpoint instead.`,
      );
    }

    // Create subscription history record
    const pricing = this.planPricing[newPlan];
    await this.prisma.subscriptionHistory.create({
      data: {
        tenantId,
        previousPlan: currentPlan,
        newPlan,
        plan: newPlan, // deprecated field
        status: 'ACTIVE',
        startDate: new Date(),
        amount: pricing.basePrice,
        currency: pricing.currency,
        changeType: 'UPGRADE',
        changeReason: 'User requested upgrade',
      },
    });

    // Update tenant subscription
    const subscriptionEndDate = new Date();
    subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1); // 1 year

    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        subscriptionPlan: newPlan,
        subscriptionStartDate: new Date(),
        subscriptionEndDate,
        status: 'ACTIVE',
      },
    });

    // Emit event
    await this.eventBus.publish(EVENTS.SUBSCRIPTION_UPDATED, {
      tenantId,
      tenantName: tenant.name,
      oldPlan: currentPlan,
      newPlan,
      changeType: 'UPGRADE',
    });

    this.logger.log(
      `Subscription upgraded for tenant ${tenantId}: ${currentPlan} -> ${newPlan}`,
      'SubscriptionService',
    );
  }

  /**
   * Downgrade tenant subscription
   */
  async downgradeSubscription(
    tenantId: string,
    downgradeDto: DowngradeSubscriptionDto,
  ): Promise<void> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { subscriptionPlan: true, name: true },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant ${tenantId} not found`);
    }

    const currentPlan = tenant.subscriptionPlan as SubscriptionPlan;
    const newPlan = downgradeDto.newPlan;

    // Validate it's actually a downgrade
    if (this.planHierarchy[newPlan] >= this.planHierarchy[currentPlan]) {
      throw new BadRequestException(
        `Cannot downgrade from ${currentPlan} to ${newPlan}. Use upgrade endpoint instead.`,
      );
    }

    // Check if downgrade would violate limits
    const newLimits = this.planLimits[newPlan];
    const userCount = await this.prisma.user.count({ where: { tenantId } });

    if (newLimits.users !== -1 && userCount > newLimits.users) {
      throw new BadRequestException(
        `Cannot downgrade: Current user count (${userCount}) exceeds ${newPlan} plan limit (${newLimits.users})`,
      );
    }

    // Create subscription history record
    const pricing = this.planPricing[newPlan];
    await this.prisma.subscriptionHistory.create({
      data: {
        tenantId,
        previousPlan: currentPlan,
        newPlan,
        plan: newPlan, // deprecated field
        status: 'ACTIVE',
        startDate: new Date(),
        amount: pricing.basePrice,
        currency: pricing.currency,
        changeType: 'DOWNGRADE',
        changeReason: downgradeDto.reason || 'User requested downgrade',
      },
    });

    // Update tenant subscription
    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        subscriptionPlan: newPlan,
      },
    });

    // Emit event
    await this.eventBus.publish(EVENTS.SUBSCRIPTION_UPDATED, {
      tenantId,
      tenantName: tenant.name,
      oldPlan: currentPlan,
      newPlan,
      changeType: 'DOWNGRADE',
    });

    this.logger.log(
      `Subscription downgraded for tenant ${tenantId}: ${currentPlan} -> ${newPlan}`,
      'SubscriptionService',
    );
  }

  /**
   * Calculate overage charges for a specific month
   */
  async calculateOverage(dto: CalculateOverageDto): Promise<OverageCalculation> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: dto.tenantId },
      select: { subscriptionPlan: true },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant ${dto.tenantId} not found`);
    }

    const plan = tenant.subscriptionPlan as SubscriptionPlan;
    const limits = this.planLimits[plan];
    const pricing = this.planPricing[plan];

    // Parse month (format: YYYY-MM)
    const [year, month] = dto.month.split('-').map(Number);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    // Get average users for the month
    const users = await this.prisma.user.count({
      where: {
        tenantId: dto.tenantId,
        createdAt: { lte: endDate },
      },
    });

    // TODO: Get actual storage usage
    const storageGB = 0;

    // Get API calls for the month
    const apiCallsResult = await this.prisma.usageEvent.aggregate({
      where: {
        tenantId: dto.tenantId,
        metricType: 'API_CALL',
        createdAt: { gte: startDate, lte: endDate },
      },
      _sum: {
        metricValue: true,
      },
    });

    const apiCalls = apiCallsResult._sum.metricValue || 0;

    // Calculate overages
    const usersOverage = limits.users === -1 ? 0 : Math.max(0, users - limits.users);
    const storageOverage = limits.storage === -1 ? 0 : Math.max(0, storageGB - limits.storage);
    const apiCallsOverage = limits.apiCalls === -1 ? 0 : Math.max(0, apiCalls - limits.apiCalls);

    const usersCost = usersOverage * pricing.overageRates.perUser;
    const storageCost = storageOverage * pricing.overageRates.perGB;
    const apiCallsCost = apiCallsOverage * pricing.overageRates.perApiCall;

    const totalOverageCost = usersCost + storageCost + apiCallsCost;

    return {
      usersOverage,
      storageOverage,
      apiCallsOverage,
      totalOverageCost,
      breakdown: {
        users: { overage: usersOverage, cost: usersCost },
        storage: { overage: storageOverage, cost: storageCost },
        apiCalls: { overage: apiCallsOverage, cost: apiCallsCost },
      },
    };
  }

  /**
   * Get subscription history for a tenant
   */
  async getSubscriptionHistory(tenantId: string) {
    return this.prisma.subscriptionHistory.findMany({
      where: { tenantId },
      orderBy: { changedAt: 'desc' },
      take: 50,
    });
  }

  /**
   * Get all available plans with their features and pricing
   */
  getAllPlansInfo() {
    return Object.values(SubscriptionPlan).map((plan) => ({
      plan,
      limits: this.planLimits[plan],
      pricing: this.planPricing[plan],
      features: this.featureMatrix[plan],
      hierarchy: this.planHierarchy[plan],
    }));
  }

  /**
   * Compare two plans
   */
  comparePlans(plan1: SubscriptionPlan, plan2: SubscriptionPlan) {
    return {
      plan1: {
        plan: plan1,
        limits: this.planLimits[plan1],
        pricing: this.planPricing[plan1],
        features: this.featureMatrix[plan1],
      },
      plan2: {
        plan: plan2,
        limits: this.planLimits[plan2],
        pricing: this.planPricing[plan2],
        features: this.featureMatrix[plan2],
      },
      recommendation: this.planHierarchy[plan1] > this.planHierarchy[plan2] ? plan1 : plan2,
    };
  }
}
