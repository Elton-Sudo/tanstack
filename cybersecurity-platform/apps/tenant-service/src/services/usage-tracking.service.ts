import { DatabaseService } from '@app/database';
import { LoggerService } from '@app/logging';
import { Injectable } from '@nestjs/common';

export enum MetricType {
  API_CALL = 'API_CALL',
  USER_LOGIN = 'USER_LOGIN',
  STORAGE_UPLOAD = 'STORAGE_UPLOAD',
  STORAGE_DELETE = 'STORAGE_DELETE',
  COURSE_CREATED = 'COURSE_CREATED',
  USER_ENROLLED = 'USER_ENROLLED',
  ASSESSMENT_COMPLETED = 'ASSESSMENT_COMPLETED',
  CERTIFICATE_GENERATED = 'CERTIFICATE_GENERATED',
  REPORT_GENERATED = 'REPORT_GENERATED',
  DATA_EXPORT = 'DATA_EXPORT',
  WEBHOOK_CALL = 'WEBHOOK_CALL',
  SSO_LOGIN = 'SSO_LOGIN',
  AI_ASSESSMENT_GENERATED = 'AI_ASSESSMENT_GENERATED',
  CUSTOM_ROLE_CREATED = 'CUSTOM_ROLE_CREATED',
  GAMIFICATION_EVENT = 'GAMIFICATION_EVENT',
}

export interface UsageMetricData {
  tenantId: string;
  metricType: MetricType;
  metricValue: number;
  metadata?: Record<string, any>;
  userId?: string;
}

export interface UsageStats {
  totalApiCalls: number;
  totalLogins: number;
  totalStorageUsed: number;
  totalCourses: number;
  totalEnrollments: number;
  totalAssessments: number;
  totalCertificates: number;
  totalReports: number;
  totalExports: number;
  totalWebhookCalls: number;
  totalAiAssessments: number;
  totalGamificationEvents: number;
}

export interface UsageByPeriod {
  period: string; // YYYY-MM-DD or YYYY-MM
  metrics: Record<MetricType, number>;
  totalEvents: number;
}

@Injectable()
export class UsageTrackingService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly logger: LoggerService,
  ) {}

  /**
   * Track a single usage metric
   */
  async trackMetric(data: UsageMetricData): Promise<void> {
    try {
      await this.prisma.usageEvent.create({
        data: {
          tenantId: data.tenantId,
          metricType: data.metricType,
          metricValue: data.metricValue,
          metadata: data.metadata || {},
          userId: data.userId,
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to track metric ${data.metricType} for tenant ${data.tenantId}: ${error.message}`,
        error.stack,
        'UsageTrackingService',
      );
    }
  }

  /**
   * Track multiple metrics in batch
   */
  async trackMetricsBatch(metrics: UsageMetricData[]): Promise<void> {
    try {
      await this.prisma.usageEvent.createMany({
        data: metrics.map((metric) => ({
          tenantId: metric.tenantId,
          metricType: metric.metricType,
          metricValue: metric.metricValue,
          metadata: metric.metadata || {},
          userId: metric.userId,
        })),
      });
    } catch (error) {
      this.logger.error(
        `Failed to track batch metrics: ${error.message}`,
        error.stack,
        'UsageTrackingService',
      );
    }
  }

  /**
   * Track API call
   */
  async trackApiCall(
    tenantId: string,
    endpoint: string,
    method: string,
    userId?: string,
  ): Promise<void> {
    await this.trackMetric({
      tenantId,
      metricType: MetricType.API_CALL,
      metricValue: 1,
      metadata: { endpoint, method },
      userId,
    });
  }

  /**
   * Track user login
   */
  async trackUserLogin(tenantId: string, userId: string, loginMethod: string): Promise<void> {
    await this.trackMetric({
      tenantId,
      metricType: MetricType.USER_LOGIN,
      metricValue: 1,
      metadata: { loginMethod },
      userId,
    });
  }

  /**
   * Track storage upload
   */
  async trackStorageUpload(
    tenantId: string,
    fileSizeBytes: number,
    fileType: string,
    userId?: string,
  ): Promise<void> {
    await this.trackMetric({
      tenantId,
      metricType: MetricType.STORAGE_UPLOAD,
      metricValue: fileSizeBytes,
      metadata: { fileType, sizeBytes: fileSizeBytes },
      userId,
    });
  }

  /**
   * Track storage deletion
   */
  async trackStorageDelete(
    tenantId: string,
    fileSizeBytes: number,
    fileType: string,
    userId?: string,
  ): Promise<void> {
    await this.trackMetric({
      tenantId,
      metricType: MetricType.STORAGE_DELETE,
      metricValue: fileSizeBytes,
      metadata: { fileType, sizeBytes: fileSizeBytes },
      userId,
    });
  }

  /**
   * Track course creation
   */
  async trackCourseCreated(tenantId: string, courseId: string, userId?: string): Promise<void> {
    await this.trackMetric({
      tenantId,
      metricType: MetricType.COURSE_CREATED,
      metricValue: 1,
      metadata: { courseId },
      userId,
    });
  }

  /**
   * Track user enrollment
   */
  async trackUserEnrolled(
    tenantId: string,
    courseId: string,
    enrolledUserId: string,
  ): Promise<void> {
    await this.trackMetric({
      tenantId,
      metricType: MetricType.USER_ENROLLED,
      metricValue: 1,
      metadata: { courseId, enrolledUserId },
    });
  }

  /**
   * Track assessment completion
   */
  async trackAssessmentCompleted(
    tenantId: string,
    assessmentId: string,
    score: number,
    userId: string,
  ): Promise<void> {
    await this.trackMetric({
      tenantId,
      metricType: MetricType.ASSESSMENT_COMPLETED,
      metricValue: 1,
      metadata: { assessmentId, score },
      userId,
    });
  }

  /**
   * Track certificate generation
   */
  async trackCertificateGenerated(
    tenantId: string,
    certificateId: string,
    userId: string,
  ): Promise<void> {
    await this.trackMetric({
      tenantId,
      metricType: MetricType.CERTIFICATE_GENERATED,
      metricValue: 1,
      metadata: { certificateId },
      userId,
    });
  }

  /**
   * Track report generation
   */
  async trackReportGenerated(tenantId: string, reportType: string, userId?: string): Promise<void> {
    await this.trackMetric({
      tenantId,
      metricType: MetricType.REPORT_GENERATED,
      metricValue: 1,
      metadata: { reportType },
      userId,
    });
  }

  /**
   * Track data export
   */
  async trackDataExport(
    tenantId: string,
    exportType: string,
    recordCount: number,
    userId?: string,
  ): Promise<void> {
    await this.trackMetric({
      tenantId,
      metricType: MetricType.DATA_EXPORT,
      metricValue: recordCount,
      metadata: { exportType, recordCount },
      userId,
    });
  }

  /**
   * Track webhook call
   */
  async trackWebhookCall(tenantId: string, webhookUrl: string, eventType: string): Promise<void> {
    await this.trackMetric({
      tenantId,
      metricType: MetricType.WEBHOOK_CALL,
      metricValue: 1,
      metadata: { webhookUrl, eventType },
    });
  }

  /**
   * Track AI assessment generation
   */
  async trackAiAssessment(
    tenantId: string,
    assessmentId: string,
    questionCount: number,
    userId?: string,
  ): Promise<void> {
    await this.trackMetric({
      tenantId,
      metricType: MetricType.AI_ASSESSMENT_GENERATED,
      metricValue: questionCount,
      metadata: { assessmentId, questionCount },
      userId,
    });
  }

  /**
   * Track gamification event
   */
  async trackGamificationEvent(
    tenantId: string,
    eventType: string,
    points: number,
    userId: string,
  ): Promise<void> {
    await this.trackMetric({
      tenantId,
      metricType: MetricType.GAMIFICATION_EVENT,
      metricValue: points,
      metadata: { eventType },
      userId,
    });
  }

  /**
   * Get usage statistics for a tenant
   */
  async getUsageStats(tenantId: string, startDate?: Date, endDate?: Date): Promise<UsageStats> {
    const where: any = { tenantId };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const metrics = await this.prisma.usageEvent.groupBy({
      by: ['metricType'],
      where,
      _sum: {
        metricValue: true,
      },
      _count: true,
    });

    const stats: UsageStats = {
      totalApiCalls: 0,
      totalLogins: 0,
      totalStorageUsed: 0,
      totalCourses: 0,
      totalEnrollments: 0,
      totalAssessments: 0,
      totalCertificates: 0,
      totalReports: 0,
      totalExports: 0,
      totalWebhookCalls: 0,
      totalAiAssessments: 0,
      totalGamificationEvents: 0,
    };

    metrics.forEach((metric) => {
      const value = metric._sum.metricValue || 0;

      switch (metric.metricType) {
        case MetricType.API_CALL:
          stats.totalApiCalls = value;
          break;
        case MetricType.USER_LOGIN:
          stats.totalLogins = value;
          break;
        case MetricType.STORAGE_UPLOAD:
          stats.totalStorageUsed += value;
          break;
        case MetricType.STORAGE_DELETE:
          stats.totalStorageUsed -= value;
          break;
        case MetricType.COURSE_CREATED:
          stats.totalCourses = value;
          break;
        case MetricType.USER_ENROLLED:
          stats.totalEnrollments = value;
          break;
        case MetricType.ASSESSMENT_COMPLETED:
          stats.totalAssessments = value;
          break;
        case MetricType.CERTIFICATE_GENERATED:
          stats.totalCertificates = value;
          break;
        case MetricType.REPORT_GENERATED:
          stats.totalReports = value;
          break;
        case MetricType.DATA_EXPORT:
          stats.totalExports = value;
          break;
        case MetricType.WEBHOOK_CALL:
          stats.totalWebhookCalls = value;
          break;
        case MetricType.AI_ASSESSMENT_GENERATED:
          stats.totalAiAssessments = value;
          break;
        case MetricType.GAMIFICATION_EVENT:
          stats.totalGamificationEvents = value;
          break;
      }
    });

    // Convert storage from bytes to GB
    stats.totalStorageUsed = stats.totalStorageUsed / (1024 * 1024 * 1024);

    return stats;
  }

  /**
   * Get usage by period (daily or monthly)
   */
  async getUsageByPeriod(
    tenantId: string,
    startDate: Date,
    endDate: Date,
    groupBy: 'day' | 'month' = 'day',
  ): Promise<UsageByPeriod[]> {
    const metrics = await this.prisma.usageEvent.findMany({
      where: {
        tenantId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        metricType: true,
        metricValue: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Group metrics by period
    const grouped = new Map<string, Record<MetricType, number>>();

    metrics.forEach((metric) => {
      const date = new Date(metric.createdAt);
      let period: string;

      if (groupBy === 'day') {
        period = date.toISOString().split('T')[0]; // YYYY-MM-DD
      } else {
        period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM
      }

      if (!grouped.has(period)) {
        grouped.set(period, {} as Record<MetricType, number>);
      }

      const periodMetrics = grouped.get(period)!;
      const metricType = metric.metricType as MetricType;

      periodMetrics[metricType] = (periodMetrics[metricType] || 0) + metric.metricValue;
    });

    // Convert to array
    return Array.from(grouped.entries()).map(([period, metrics]) => {
      const totalEvents = Object.values(metrics).reduce((sum, value) => sum + value, 0);
      return {
        period,
        metrics,
        totalEvents,
      };
    });
  }

  /**
   * Get API calls count for current month
   */
  async getMonthlyApiCalls(tenantId: string): Promise<number> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const result = await this.prisma.usageEvent.aggregate({
      where: {
        tenantId,
        metricType: MetricType.API_CALL,
        createdAt: { gte: startOfMonth },
      },
      _sum: {
        metricValue: true,
      },
    });

    return result._sum.metricValue || 0;
  }

  /**
   * Get storage usage in bytes
   */
  async getStorageUsage(tenantId: string): Promise<number> {
    const [uploads, deletes] = await Promise.all([
      this.prisma.usageEvent.aggregate({
        where: {
          tenantId,
          metricType: MetricType.STORAGE_UPLOAD,
        },
        _sum: {
          metricValue: true,
        },
      }),
      this.prisma.usageEvent.aggregate({
        where: {
          tenantId,
          metricType: MetricType.STORAGE_DELETE,
        },
        _sum: {
          metricValue: true,
        },
      }),
    ]);

    const uploaded = uploads._sum.metricValue || 0;
    const deleted = deletes._sum.metricValue || 0;

    return Math.max(0, uploaded - deleted);
  }

  /**
   * Get storage usage in GB
   */
  async getStorageUsageGB(tenantId: string): Promise<number> {
    const bytes = await this.getStorageUsage(tenantId);
    return bytes / (1024 * 1024 * 1024);
  }

  /**
   * Get top users by activity
   */
  async getTopUsers(
    tenantId: string,
    limit: number = 10,
    startDate?: Date,
    endDate?: Date,
  ): Promise<Array<{ userId: string; activityCount: number }>> {
    const where: any = {
      tenantId,
      userId: { not: null },
    };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const result = await this.prisma.usageEvent.groupBy({
      by: ['userId'],
      where,
      _count: true,
      orderBy: {
        _count: {
          userId: 'desc',
        },
      },
      take: limit,
    });

    return result
      .filter((item) => item.userId)
      .map((item) => ({
        userId: item.userId!,
        activityCount: item._count,
      }));
  }

  /**
   * Clean up old metrics (for data retention)
   */
  async cleanupOldMetrics(retentionDays: number = 365): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const result = await this.prisma.usageEvent.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    });

    this.logger.log(
      `Cleaned up ${result.count} usage events older than ${retentionDays} days`,
      'UsageTrackingService',
    );

    return result.count;
  }
}
