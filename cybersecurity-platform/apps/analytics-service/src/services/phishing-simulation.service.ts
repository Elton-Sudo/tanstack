import { DatabaseService } from '@app/database';
import { LoggerService } from '@app/logging';
import { EventBusService, EVENTS } from '@app/messaging';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

export interface CreatePhishingCampaignDto {
  tenantId: string;
  name: string;
  description?: string;
  subject: string;
  emailTemplate: string;
  targetUserIds?: string[];
  targetDepartmentIds?: string[];
  scheduledFor?: Date;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
  redFlags: string[]; // Red flags present in the email
}

export interface RecordPhishingEventDto {
  userId: string;
  campaignId: string;
  action: 'SENT' | 'OPENED' | 'CLICKED' | 'REPORTED' | 'DELETED';
  metadata?: any;
}

export interface PhishingCampaignStatsDto {
  campaignId: string;
  totalSent: number;
  opened: number;
  clicked: number;
  reported: number;
  clickRate: number;
  reportRate: number;
  openRate: number;
  averageTimeToClick?: number;
  averageTimeToReport?: number;
}

/**
 * Service for managing phishing simulations and tracking user responses
 * Helps assess cybersecurity awareness and training effectiveness
 */
@Injectable()
export class PhishingSimulationService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly logger: LoggerService,
    private readonly eventBus: EventBusService,
  ) {}

  /**
   * Create a phishing simulation campaign
   */
  async createCampaign(dto: CreatePhishingCampaignDto, createdBy: string) {
    // Determine target users
    let targetUserIds = dto.targetUserIds || [];

    // If department IDs provided, get all users in those departments
    if (dto.targetDepartmentIds && dto.targetDepartmentIds.length > 0) {
      const departmentUsers = await this.prisma.user.findMany({
        where: {
          tenantId: dto.tenantId,
          departmentId: { in: dto.targetDepartmentIds },
        },
        select: { id: true },
      });
      targetUserIds = [...targetUserIds, ...departmentUsers.map((u) => u.id)];
    }

    // If no targets specified, get all users in tenant
    if (targetUserIds.length === 0) {
      const allUsers = await this.prisma.user.findMany({
        where: { tenantId: dto.tenantId },
        select: { id: true },
      });
      targetUserIds = allUsers.map((u) => u.id);
    }

    // Remove duplicates
    targetUserIds = [...new Set(targetUserIds)];

    const campaignId = this.generateCampaignId();

    // Create phishing events for all targets
    const events = targetUserIds.map((userId) => ({
      tenantId: dto.tenantId,
      userId,
      campaignId,
      subject: dto.subject,
      sentAt: dto.scheduledFor || new Date(),
      metadata: {
        difficulty: dto.difficulty,
        redFlags: dto.redFlags,
        template: dto.emailTemplate,
      },
    }));

    await this.prisma.phishingEvent.createMany({
      data: events,
    });

    this.logger.log(
      `Phishing campaign created: ${campaignId} with ${targetUserIds.length} targets`,
      'PhishingSimulationService',
    );

    await this.eventBus.publish(EVENTS.PHISHING_SIMULATION_STARTED, {
      campaignId,
      tenantId: dto.tenantId,
      targetCount: targetUserIds.length,
      difficulty: dto.difficulty,
      createdBy,
    });

    return {
      campaignId,
      targetCount: targetUserIds.length,
      scheduledFor: dto.scheduledFor || new Date(),
    };
  }

  /**
   * Record phishing event (click, report, etc.)
   */
  async recordEvent(tenantId: string, dto: RecordPhishingEventDto) {
    const event = await this.prisma.phishingEvent.findFirst({
      where: {
        tenantId,
        userId: dto.userId,
        campaignId: dto.campaignId,
      },
    });

    if (!event) {
      throw new NotFoundException('Phishing event not found');
    }

    const now = new Date();
    const updateData: any = { metadata: { ...(event.metadata as any), ...dto.metadata } };

    switch (dto.action) {
      case 'CLICKED':
        if (event.clicked) {
          throw new BadRequestException('Click already recorded for this event');
        }
        updateData.clicked = true;
        updateData.clickedAt = now;
        break;

      case 'REPORTED':
        if (event.reported) {
          throw new BadRequestException('Report already recorded for this event');
        }
        updateData.reported = true;
        updateData.reportedAt = now;
        break;

      default:
        updateData.metadata = {
          ...(event.metadata as any),
          [dto.action.toLowerCase()]: {
            timestamp: now,
            ...dto.metadata,
          },
        };
    }

    const updated = await this.prisma.phishingEvent.update({
      where: { id: event.id },
      data: updateData,
    });

    this.logger.log(
      `Phishing event recorded: ${dto.action} for user ${dto.userId} in campaign ${dto.campaignId}`,
      'PhishingSimulationService',
    );

    await this.eventBus.publish('phishing.event.recorded', {
      eventId: updated.id,
      userId: dto.userId,
      campaignId: dto.campaignId,
      action: dto.action,
      tenantId,
    });

    // If user clicked, update risk score
    if (dto.action === 'CLICKED') {
      await this.eventBus.publish(EVENTS.PHISHING_CLICKED, {
        userId: dto.userId,
        campaignId: dto.campaignId,
        tenantId,
      });
    }

    // If user reported, positive signal for risk score
    if (dto.action === 'REPORTED') {
      await this.eventBus.publish(EVENTS.PHISHING_REPORTED, {
        userId: dto.userId,
        campaignId: dto.campaignId,
        tenantId,
      });
    }

    return updated;
  }

  /**
   * Get campaign statistics
   */
  async getCampaignStats(tenantId: string, campaignId: string): Promise<PhishingCampaignStatsDto> {
    const events = await this.prisma.phishingEvent.findMany({
      where: { tenantId, campaignId },
    });

    if (events.length === 0) {
      throw new NotFoundException('Campaign not found');
    }

    const totalSent = events.length;
    const clicked = events.filter((e) => e.clicked).length;
    const reported = events.filter((e) => e.reported).length;

    // Calculate opened (we can track this via email tracking pixels in production)
    const opened = events.filter((e) => (e.metadata as any)?.opened).length;

    // Calculate average times
    const clickTimes = events
      .filter((e) => e.clicked && e.clickedAt && e.sentAt)
      .map((e) => (e.clickedAt!.getTime() - e.sentAt.getTime()) / 1000 / 60); // minutes

    const reportTimes = events
      .filter((e) => e.reported && e.reportedAt && e.sentAt)
      .map((e) => (e.reportedAt!.getTime() - e.sentAt.getTime()) / 1000 / 60); // minutes

    const averageTimeToClick =
      clickTimes.length > 0 ? clickTimes.reduce((a, b) => a + b, 0) / clickTimes.length : undefined;

    const averageTimeToReport =
      reportTimes.length > 0
        ? reportTimes.reduce((a, b) => a + b, 0) / reportTimes.length
        : undefined;

    return {
      campaignId,
      totalSent,
      opened,
      clicked,
      reported,
      clickRate: (clicked / totalSent) * 100,
      reportRate: (reported / totalSent) * 100,
      openRate: (opened / totalSent) * 100,
      averageTimeToClick,
      averageTimeToReport,
    };
  }

  /**
   * Get user's phishing history
   */
  async getUserPhishingHistory(tenantId: string, userId: string) {
    const events = await this.prisma.phishingEvent.findMany({
      where: { tenantId, userId },
      orderBy: { sentAt: 'desc' },
    });

    const totalReceived = events.length;
    const clicked = events.filter((e) => e.clicked).length;
    const reported = events.filter((e) => e.reported).length;

    return {
      totalReceived,
      clicked,
      reported,
      clickRate: totalReceived > 0 ? (clicked / totalReceived) * 100 : 0,
      reportRate: totalReceived > 0 ? (reported / totalReceived) * 100 : 0,
      events: events.map((e) => ({
        id: e.id,
        campaignId: e.campaignId,
        subject: e.subject,
        sentAt: e.sentAt,
        clicked: e.clicked,
        clickedAt: e.clickedAt,
        reported: e.reported,
        reportedAt: e.reportedAt,
        difficulty: (e.metadata as any)?.difficulty,
      })),
    };
  }

  /**
   * Get tenant-wide phishing statistics
   */
  async getTenantPhishingStats(tenantId: string, startDate?: Date, endDate?: Date) {
    const where: any = { tenantId };

    if (startDate || endDate) {
      where.sentAt = {};
      if (startDate) where.sentAt.gte = startDate;
      if (endDate) where.sentAt.lte = endDate;
    }

    const [totalEvents, clickedEvents, reportedEvents] = await Promise.all([
      this.prisma.phishingEvent.count({ where }),
      this.prisma.phishingEvent.count({
        where: { ...where, clicked: true },
      }),
      this.prisma.phishingEvent.count({
        where: { ...where, reported: true },
      }),
    ]);

    // Get unique campaigns
    const campaigns = await this.prisma.phishingEvent.findMany({
      where,
      select: { campaignId: true },
      distinct: ['campaignId'],
    });

    return {
      totalSimulations: totalEvents,
      totalCampaigns: campaigns.length,
      clicked: clickedEvents,
      reported: reportedEvents,
      clickRate: totalEvents > 0 ? (clickedEvents / totalEvents) * 100 : 0,
      reportRate: totalEvents > 0 ? (reportedEvents / totalEvents) * 100 : 0,
      period: {
        startDate,
        endDate,
      },
    };
  }

  /**
   * Get most vulnerable users (highest click rate)
   */
  async getVulnerableUsers(tenantId: string, limit: number = 10) {
    // Get all phishing events grouped by user
    const events = await this.prisma.phishingEvent.findMany({
      where: { tenantId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            department: true,
          },
        },
      },
    });

    // Group by user and calculate stats
    const userStats = new Map<string, any>();

    events.forEach((event) => {
      if (!userStats.has(event.userId)) {
        userStats.set(event.userId, {
          user: event.user,
          totalReceived: 0,
          clicked: 0,
          reported: 0,
        });
      }

      const stats = userStats.get(event.userId);
      stats.totalReceived++;
      if (event.clicked) stats.clicked++;
      if (event.reported) stats.reported++;
    });

    // Convert to array and calculate rates
    const usersArray = Array.from(userStats.values()).map((stats) => ({
      ...stats,
      clickRate: (stats.clicked / stats.totalReceived) * 100,
      reportRate: (stats.reported / stats.totalReceived) * 100,
    }));

    // Sort by click rate descending
    usersArray.sort((a, b) => b.clickRate - a.clickRate);

    return usersArray.slice(0, limit);
  }

  /**
   * Get best performers (highest report rate, lowest click rate)
   */
  async getBestPerformers(tenantId: string, limit: number = 10) {
    const events = await this.prisma.phishingEvent.findMany({
      where: { tenantId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            department: true,
          },
        },
      },
    });

    const userStats = new Map<string, any>();

    events.forEach((event) => {
      if (!userStats.has(event.userId)) {
        userStats.set(event.userId, {
          user: event.user,
          totalReceived: 0,
          clicked: 0,
          reported: 0,
        });
      }

      const stats = userStats.get(event.userId);
      stats.totalReceived++;
      if (event.clicked) stats.clicked++;
      if (event.reported) stats.reported++;
    });

    const usersArray = Array.from(userStats.values()).map((stats) => ({
      ...stats,
      clickRate: (stats.clicked / stats.totalReceived) * 100,
      reportRate: (stats.reported / stats.totalReceived) * 100,
      score: stats.reported * 2 - stats.clicked, // Higher score = better
    }));

    // Sort by score descending
    usersArray.sort((a, b) => b.score - a.score);

    return usersArray.slice(0, limit);
  }

  /**
   * Get department comparison
   */
  async getDepartmentComparison(tenantId: string) {
    const events = await this.prisma.phishingEvent.findMany({
      where: { tenantId },
      include: {
        user: {
          select: {
            departmentId: true,
            department: true,
          },
        },
      },
    });

    const deptStats = new Map<string, any>();

    events.forEach((event) => {
      const deptId = event.user.departmentId || 'unassigned';
      const deptName = event.user.department || 'Unassigned';

      if (!deptStats.has(deptId)) {
        deptStats.set(deptId, {
          departmentId: deptId,
          departmentName: deptName,
          totalReceived: 0,
          clicked: 0,
          reported: 0,
        });
      }

      const stats = deptStats.get(deptId);
      stats.totalReceived++;
      if (event.clicked) stats.clicked++;
      if (event.reported) stats.reported++;
    });

    return Array.from(deptStats.values()).map((stats) => ({
      ...stats,
      clickRate: (stats.clicked / stats.totalReceived) * 100,
      reportRate: (stats.reported / stats.totalReceived) * 100,
    }));
  }

  /**
   * Generate campaign ID
   */
  private generateCampaignId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `PHISH-${timestamp}-${random}`.toUpperCase();
  }

  /**
   * Get template recommendations based on user's history
   */
  async getTemplateRecommendations(tenantId: string, userId: string) {
    const history = await this.getUserPhishingHistory(tenantId, userId);

    // Analyze which difficulty levels user struggles with
    const difficultyPerformance = new Map<string, { total: number; clicked: number }>();

    history.events.forEach((event) => {
      const difficulty = event.difficulty || 'MEDIUM';
      if (!difficultyPerformance.has(difficulty)) {
        difficultyPerformance.set(difficulty, { total: 0, clicked: 0 });
      }
      const perf = difficultyPerformance.get(difficulty)!;
      perf.total++;
      if (event.clicked) perf.clicked++;
    });

    const recommendations = [];

    // Recommend harder templates if user is doing well
    if (history.clickRate < 10 && history.reportRate > 70) {
      recommendations.push({
        difficulty: 'EXPERT',
        reason: 'User demonstrates excellent awareness, ready for advanced scenarios',
      });
    } else if (history.clickRate < 20 && history.reportRate > 50) {
      recommendations.push({
        difficulty: 'HARD',
        reason: 'User shows good awareness, can handle more sophisticated attacks',
      });
    } else if (history.clickRate > 50) {
      recommendations.push({
        difficulty: 'EASY',
        reason: 'User needs more practice with basic phishing indicators',
      });
    } else {
      recommendations.push({
        difficulty: 'MEDIUM',
        reason: 'User shows moderate awareness, continue with standard training',
      });
    }

    return {
      userPerformance: {
        clickRate: history.clickRate,
        reportRate: history.reportRate,
        totalSimulations: history.totalReceived,
      },
      recommendations,
    };
  }
}
