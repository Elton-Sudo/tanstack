import { PaginatedResponseDto, PaginationDto } from '@app/common';
import { DatabaseService } from '@app/database';
import { LoggerService } from '@app/logging';
import { Injectable } from '@nestjs/common';
import { ReportSecurityEventDto } from '../dto/audit.dto';

@Injectable()
export class AuditService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly logger: LoggerService,
  ) {}

  async getLoginHistory(userId: string, pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where: {
          userId,
          action: { in: ['LOGIN', 'LOGOUT', 'LOGIN_FAILED'] },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          action: true,
          ipAddress: true,
          userAgent: true,
          metadata: true,
          createdAt: true,
        },
      }),
      this.prisma.auditLog.count({
        where: {
          userId,
          action: { in: ['LOGIN', 'LOGOUT', 'LOGIN_FAILED'] },
        },
      }),
    ]);

    return new PaginatedResponseDto(logs, total, page, limit);
  }

  async getSecurityEvents(pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where: {
          action: {
            in: [
              'LOGIN_FAILED',
              'ACCOUNT_LOCKED',
              'PASSWORD_CHANGED',
              'MFA_ENABLED',
              'MFA_DISABLED',
              'SUSPICIOUS_ACTIVITY',
            ],
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      this.prisma.auditLog.count({
        where: {
          action: {
            in: [
              'LOGIN_FAILED',
              'ACCOUNT_LOCKED',
              'PASSWORD_CHANGED',
              'MFA_ENABLED',
              'MFA_DISABLED',
              'SUSPICIOUS_ACTIVITY',
            ],
          },
        },
      }),
    ]);

    return new PaginatedResponseDto(events, total, page, limit);
  }

  async reportSecurityEvent(userId: string, reportDto: ReportSecurityEventDto) {
    await this.prisma.auditLog.create({
      data: {
        userId,
        tenantId: reportDto.tenantId,
        action: 'SUSPICIOUS_ACTIVITY_REPORTED',
        resource: 'SECURITY',
        ipAddress: reportDto.ipAddress,
        metadata: {
          description: reportDto.description,
          type: reportDto.type,
        },
      },
    });

    this.logger.warn(
      `Security event reported by user ${userId}: ${reportDto.type}`,
      'AuditService',
    );

    return { message: 'Security event reported successfully' };
  }

  async getAuthorizedDevices(userId: string) {
    const sessions = await this.prisma.session.findMany({
      where: {
        userId,
        isRevoked: false,
        expiresAt: { gt: new Date() },
      },
      select: {
        id: true,
        userAgent: true,
        ipAddress: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const devices = sessions.map((session) => ({
      id: session.id,
      device: this.parseDeviceInfo(session.userAgent),
      ipAddress: session.ipAddress,
      lastActive: session.createdAt,
    }));

    // Remove duplicates based on userAgent
    const uniqueDevices = devices.filter(
      (device, index, self) => index === self.findIndex((d) => d.device === device.device),
    );

    return {
      devices: uniqueDevices,
      total: uniqueDevices.length,
    };
  }

  async logAuditEvent(
    userId: string | null,
    tenantId: string,
    action: string,
    resource: string,
    resourceId?: string,
    metadata?: any,
  ) {
    await this.prisma.auditLog.create({
      data: {
        userId,
        tenantId,
        action,
        resource,
        resourceId,
        metadata,
      },
    });
  }

  private parseDeviceInfo(userAgent: string): string {
    if (userAgent.includes('Windows')) return 'Windows PC';
    if (userAgent.includes('Macintosh')) return 'Mac';
    if (userAgent.includes('Linux')) return 'Linux PC';
    if (userAgent.includes('iPhone')) return 'iPhone';
    if (userAgent.includes('iPad')) return 'iPad';
    if (userAgent.includes('Android')) return 'Android Device';
    return 'Unknown Device';
  }
}
