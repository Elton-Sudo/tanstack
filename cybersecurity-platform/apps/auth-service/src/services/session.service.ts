import { DatabaseService } from '@app/database';
import { LoggerService } from '@app/logging';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class SessionService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly logger: LoggerService,
  ) {}

  async getUserSessions(userId: string) {
    const sessions = await this.prisma.session.findMany({
      where: {
        userId,
        isRevoked: false,
        expiresAt: { gt: new Date() },
      },
      select: {
        id: true,
        ipAddress: true,
        userAgent: true,
        createdAt: true,
        expiresAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      sessions: sessions.map((session) => ({
        ...session,
        isCurrent: false, // Would need to check against current token
        device: this.parseUserAgent(session.userAgent),
      })),
      total: sessions.length,
    };
  }

  async getCurrentSession(userId: string) {
    // In production, get current session from JWT token
    const latestSession = await this.prisma.session.findFirst({
      where: {
        userId,
        isRevoked: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!latestSession) {
      throw new NotFoundException('No active session found');
    }

    return {
      id: latestSession.id,
      ipAddress: latestSession.ipAddress,
      device: this.parseUserAgent(latestSession.userAgent),
      createdAt: latestSession.createdAt,
      expiresAt: latestSession.expiresAt,
    };
  }

  async revokeSession(userId: string, sessionId: string) {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.userId !== userId) {
      throw new ForbiddenException('Cannot revoke another user\`s session');
    }

    await this.prisma.session.update({
      where: { id: sessionId },
      data: { isRevoked: true },
    });

    this.logger.log(`Session revoked: ${sessionId} for user: ${userId}`, 'SessionService');

    return { message: 'Session revoked successfully' };
  }

  async revokeAllSessions(userId: string) {
    const result = await this.prisma.session.updateMany({
      where: {
        userId,
        isRevoked: false,
      },
      data: { isRevoked: true },
    });

    this.logger.log(`All sessions revoked for user: ${userId}`, 'SessionService');

    return {
      message: 'All sessions revoked successfully',
      revokedCount: result.count,
    };
  }

  private parseUserAgent(userAgent: string): string {
    // Simple user agent parsing - use a library like ua-parser-js in production
    if (userAgent.includes('Chrome')) return 'Chrome Browser';
    if (userAgent.includes('Firefox')) return 'Firefox Browser';
    if (userAgent.includes('Safari')) return 'Safari Browser';
    if (userAgent.includes('Edge')) return 'Edge Browser';
    return 'Unknown Device';
  }
}
