import { DatabaseService } from '@app/database';
import { LoggerService } from '@app/logging';
import { EventBusService, EVENTS } from '@app/messaging';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import {
  ChangeUserRoleDto,
  CreateUserDto,
  InviteUserDto,
  ResetUserPasswordDto,
  UpdateUserDto,
  UserSearchDto,
} from '../dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly logger: LoggerService,
    private readonly eventBus: EventBusService,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    createdBy: string,
  ): Promise<Omit<User, 'passwordHash'>> {
    const { email, password, tenantId, ...data } = createUserDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: { email, tenantId },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists in this tenant');
    }

    // Check tenant user limit
    await this.validateTenantUserLimit(tenantId);

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        tenantId,
        role: data.role || 'USER',
        phoneNumber: data.phoneNumber,
        department: data.department,
        position: data.position,
        emailVerified: false,
      },
    });

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    await this.prisma.user.update({
      where: { id: user.id },
      data: { verificationToken },
    });

    // Send verification email if requested
    if (createUserDto.sendInvitation) {
      await this.eventBus.publish(EVENTS.USER_CREATED, {
        userId: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        tenantId: user.tenantId,
        verificationToken,
      });
    }

    this.logger.log(`User created: ${user.email} by ${createdBy}`, 'UserService');

    const { passwordHash: password_hash, ...userWithoutPassword } = user;
    void password_hash; // Suppress unused variable
    return userWithoutPassword;
  }

  async findAll(tenantId: string, page: number = 1, limit: number = 20, searchDto?: UserSearchDto) {
    const skip = (page - 1) * limit;

    const where: any = { tenantId };

    if (searchDto?.search) {
      where.OR = [
        { email: { contains: searchDto.search, mode: 'insensitive' } },
        { firstName: { contains: searchDto.search, mode: 'insensitive' } },
        { lastName: { contains: searchDto.search, mode: 'insensitive' } },
      ];
    }

    if (searchDto?.role) {
      where.role = searchDto.role;
    }

    if (searchDto?.department) {
      where.department = searchDto.department;
    }

    if (searchDto?.emailVerified !== undefined) {
      where.emailVerified = searchDto.emailVerified;
    }

    if (searchDto?.mfaEnabled !== undefined) {
      where.mfaEnabled = searchDto.mfaEnabled;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          department: true,
          position: true,
          phoneNumber: true,
          avatar: true,
          emailVerified: true,
          mfaEnabled: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, tenantId: string): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.prisma.user.findFirst({
      where: { id, tenantId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID '${id}' not found`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async update(
    id: string,
    tenantId: string,
    updateUserDto: UpdateUserDto,
    updatedBy: string,
  ): Promise<Omit<User, 'passwordHash'>> {
    // Verify user exists and belongs to tenant
    await this.findOne(id, tenantId);

    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    await this.eventBus.publish(EVENTS.USER_UPDATED, {
      userId: user.id,
      tenantId: user.tenantId,
      changes: Object.keys(updateUserDto),
      updatedBy,
    });

    this.logger.log(`User updated: ${id} by ${updatedBy}`, 'UserService');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async delete(id: string, tenantId: string, deletedBy: string): Promise<void> {
    // Verify user exists and belongs to tenant
    const user = await this.findOne(id, tenantId);

    // Cannot delete super admin
    if (user.role === 'SUPER_ADMIN') {
      throw new ForbiddenException('Cannot delete super admin user');
    }

    // Soft delete by updating email and marking as deleted
    await this.prisma.user.update({
      where: { id },
      data: {
        email: `deleted_${Date.now()}_${user.email}`,
        emailVerified: false,
        mfaEnabled: false,
        mfaSecret: null,
      },
    });

    // Revoke all sessions
    await this.prisma.session.updateMany({
      where: { userId: id },
      data: { isRevoked: true },
    });

    await this.eventBus.publish(EVENTS.USER_DELETED, {
      userId: id,
      tenantId,
      deletedBy,
    });

    this.logger.log(`User deleted: ${id} by ${deletedBy}`, 'UserService');
  }

  async inviteUser(
    inviteUserDto: InviteUserDto,
    tenantId: string,
    invitedBy: string,
  ): Promise<{ invitationToken: string; expiresAt: Date }> {
    const { email, ...data } = inviteUserDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: { email, tenantId },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists in this tenant');
    }

    // Check tenant user limit
    await this.validateTenantUserLimit(tenantId);

    // Generate invitation token
    const invitationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Create user with temporary password
    const tempPassword = crypto.randomBytes(16).toString('hex');
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        tenantId,
        role: data.role || 'USER',
        department: data.department,
        position: data.position,
        emailVerified: false,
        verificationToken: invitationToken,
      },
    });

    // Emit invitation event
    await this.eventBus.publish(EVENTS.USER_INVITED, {
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      tenantId,
      invitationToken,
      expiresAt,
      invitedBy,
      message: inviteUserDto.message,
    });

    this.logger.log(`User invited: ${email} to tenant ${tenantId} by ${invitedBy}`, 'UserService');

    return { invitationToken, expiresAt };
  }

  async bulkCreate(
    users: CreateUserDto[],
    createdBy: string,
  ): Promise<{ created: number; failed: number; errors: any[] }> {
    const results = { created: 0, failed: 0, errors: [] };

    for (const userDto of users) {
      try {
        await this.create(userDto, createdBy);
        results.created++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          email: userDto.email,
          error: error.message,
        });
      }
    }

    this.logger.log(
      `Bulk user creation: ${results.created} created, ${results.failed} failed`,
      'UserService',
    );

    return results;
  }

  async changeRole(
    id: string,
    tenantId: string,
    changeRoleDto: ChangeUserRoleDto,
    changedBy: string,
  ): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.findOne(id, tenantId);

    // Cannot change super admin role
    if (user.role === 'SUPER_ADMIN') {
      throw new ForbiddenException('Cannot change super admin role');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { role: changeRoleDto.role },
    });

    // Log role change
    await this.prisma.auditLog.create({
      data: {
        tenantId,
        action: 'role_changed',
        resource: 'User',
        resourceId: id,
        metadata: {
          oldRole: user.role,
          newRole: changeRoleDto.role,
          reason: changeRoleDto.reason,
          changedBy,
        },
      },
    });

    this.logger.log(
      `User role changed: ${id} from ${user.role} to ${changeRoleDto.role} by ${changedBy}`,
      'UserService',
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async resetPassword(
    id: string,
    tenantId: string,
    resetPasswordDto: ResetUserPasswordDto,
    resetBy: string,
  ): Promise<{ message: string }> {
    await this.findOne(id, tenantId);

    const passwordHash = await bcrypt.hash(resetPasswordDto.newPassword, 10);

    await this.prisma.user.update({
      where: { id },
      data: {
        passwordHash,
        failedAttempts: 0,
        lockedUntil: null,
      },
    });

    // Revoke all sessions
    await this.prisma.session.updateMany({
      where: { userId: id },
      data: { isRevoked: true },
    });

    this.logger.log(`Password reset for user ${id} by ${resetBy}`, 'UserService');

    return { message: 'Password reset successfully. User must login with new password.' };
  }

  async getUserActivity(id: string, tenantId: string) {
    await this.findOne(id, tenantId);

    const [loginHistory, enrollments, quizAttempts] = await Promise.all([
      this.prisma.auditLog.findMany({
        where: {
          userId: id,
          action: { in: ['login_success', 'login_failed'] },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      this.prisma.enrollment.count({
        where: { userId: id },
      }),
      this.prisma.quizAttempt.count({
        where: { userId: id },
      }),
    ]);

    return {
      recentLogins: loginHistory,
      totalEnrollments: enrollments,
      totalQuizAttempts: quizAttempts,
    };
  }

  async exportUsers(tenantId: string): Promise<any[]> {
    const users = await this.prisma.user.findMany({
      where: { tenantId },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        department: true,
        position: true,
        phoneNumber: true,
        emailVerified: true,
        mfaEnabled: true,
        lastLoginAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return users;
  }

  private async validateTenantUserLimit(tenantId: string): Promise<void> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { maxUsers: true },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    const userCount = await this.prisma.user.count({
      where: { tenantId },
    });

    if (userCount >= tenant.maxUsers) {
      throw new BadRequestException(
        `Tenant has reached maximum user limit (${tenant.maxUsers}). Please upgrade subscription.`,
      );
    }
  }
}
