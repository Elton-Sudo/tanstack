import { DatabaseService } from '@app/database';
import { LoggerService } from '@app/logging';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  AnalyzeBehaviorDto,
  BehaviorEventType,
  BehaviorPatternResponseDto,
  CalculateRiskScoreDto,
  GetBehaviorPatternsDto,
  GetCompletionRatesDto,
  GetDashboardStatsDto,
  GetEngagementMetricsDto,
  GetPhishingStatsDto,
  GetRecommendationsDto,
  GetRemediationActionsDto,
  GetRiskTrendsDto,
  GetTenantRecommendationsDto,
  GetTenantRiskOverviewDto,
  GetTrainingTrendsDto,
  ListRiskScoresDto,
  PredictComplianceDto,
  PredictRiskTrendDto,
  RecommendationResponseDto,
  RecordBehaviorEventDto,
  RecordPhishingEventDto,
  RiskLevel,
  RiskScoreResponseDto,
  TimeRange,
  TriggerAutoRemediationDto,
} from '../dto/analytics.dto';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly logger: LoggerService,
  ) {}

  // ======================== RISK SCORING ========================

  async calculateRiskScore(dto: CalculateRiskScoreDto): Promise<RiskScoreResponseDto> {
    this.logger.log(`Calculating risk score for user: ${dto.userId}`);

    // Check for recent calculation
    if (!dto.forceRecalculate) {
      const recent = await this.prisma.riskScore.findFirst({
        where: {
          userId: dto.userId,
          calculatedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
        orderBy: { calculatedAt: 'desc' },
      });

      if (recent) {
        return this.mapRiskScoreToResponse(recent);
      }
    }

    // Calculate individual scores
    const phishingScore = await this.calculatePhishingScore(dto.userId);
    const trainingCompletionScore = await this.calculateTrainingCompletionScore(dto.userId);
    const timeSinceTrainingScore = await this.calculateTimeSinceTrainingScore(dto.userId);
    const quizPerformanceScore = await this.calculateQuizPerformanceScore(dto.userId);
    const securityIncidentScore = await this.calculateSecurityIncidentScore(dto.userId);
    const loginAnomalyScore = await this.calculateLoginAnomalyScore(dto.userId);

    // Calculate weighted overall score (0-100)
    const overallScore =
      phishingScore * 0.3 +
      trainingCompletionScore * 0.25 +
      timeSinceTrainingScore * 0.15 +
      quizPerformanceScore * 0.15 +
      securityIncidentScore * 0.1 +
      loginAnomalyScore * 0.05;

    // Create risk score record
    const riskScore = await this.prisma.riskScore.create({
      data: {
        userId: dto.userId,
        tenantId: dto.tenantId,
        overallScore,
        phishingScore,
        trainingCompletionScore,
        timeSinceTrainingScore,
        quizPerformanceScore,
        securityIncidentScore,
        loginAnomalyScore,
      },
    });

    this.logger.log(`Risk score calculated: ${overallScore} for user: ${dto.userId}`);
    return this.mapRiskScoreToResponse(riskScore);
  }

  async getRiskScore(userId: string): Promise<RiskScoreResponseDto> {
    const riskScore = await this.prisma.riskScore.findFirst({
      where: { userId },
      orderBy: { calculatedAt: 'desc' },
    });

    if (!riskScore) {
      throw new NotFoundException('Risk score not found');
    }

    return this.mapRiskScoreToResponse(riskScore);
  }

  async listRiskScores(dto: ListRiskScoresDto) {
    const { page = 1, limit = 20, tenantId, riskLevel, minScore, maxScore } = dto;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (tenantId) where.tenantId = tenantId;
    if (minScore !== undefined) where.overallScore = { ...where.overallScore, gte: minScore };
    if (maxScore !== undefined) where.overallScore = { ...where.overallScore, lte: maxScore };

    const [scores, total] = await Promise.all([
      this.prisma.riskScore.findMany({
        where,
        skip,
        take: limit,
        orderBy: { overallScore: 'desc' },
        distinct: ['userId'],
      }),
      this.prisma.riskScore.count({ where }),
    ]);

    const filteredScores = riskLevel
      ? scores.filter((s) => this.determineRiskLevel(s.overallScore) === riskLevel)
      : scores;

    return {
      data: filteredScores.map((s) => this.mapRiskScoreToResponse(s)),
      total: riskLevel ? filteredScores.length : total,
      page,
      limit,
    };
  }

  async getTenantRiskOverview(dto: GetTenantRiskOverviewDto) {
    const scores = await this.prisma.riskScore.findMany({
      where: { tenantId: dto.tenantId },
      orderBy: { calculatedAt: 'desc' },
      distinct: ['userId'],
    });

    const riskDistribution = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    };

    scores.forEach((score) => {
      const level = this.determineRiskLevel(score.overallScore);
      riskDistribution[level.toLowerCase()]++;
    });

    const avgScore =
      scores.length > 0 ? scores.reduce((sum, s) => sum + s.overallScore, 0) / scores.length : 0;

    return {
      tenantId: dto.tenantId,
      totalUsers: scores.length,
      averageRiskScore: Math.round(avgScore * 100) / 100,
      riskDistribution,
      highestRiskUsers: scores
        .sort((a, b) => b.overallScore - a.overallScore)
        .slice(0, 10)
        .map((s) => ({ userId: s.userId, score: s.overallScore })),
    };
  }

  // ======================== PHISHING SIMULATION ========================

  async recordPhishingEvent(dto: RecordPhishingEventDto) {
    const event = await this.prisma.phishingSimulation.create({
      data: {
        userId: dto.userId,
        tenantId: dto.tenantId,
        campaignId: dto.campaignId,
        emailSent: new Date(),
        wasClicked: dto.wasClicked,
        wasReported: dto.wasReported,
        clickedAt: dto.wasClicked ? new Date() : null,
        reportedAt: dto.wasReported ? new Date() : null,
      },
    });

    this.logger.log(`Phishing event recorded for user: ${dto.userId}`);
    return event;
  }

  async getPhishingStats(dto: GetPhishingStatsDto) {
    const { tenantId, userId, timeRange } = dto;
    const dateFilter = this.getDateFilter(timeRange);

    const where: any = { emailSent: dateFilter };
    if (tenantId) where.tenantId = tenantId;
    if (userId) where.userId = userId;

    const [total, clicked, reported] = await Promise.all([
      this.prisma.phishingSimulation.count({ where }),
      this.prisma.phishingSimulation.count({ where: { ...where, wasClicked: true } }),
      this.prisma.phishingSimulation.count({ where: { ...where, wasReported: true } }),
    ]);

    return {
      totalSimulations: total,
      clickedCount: clicked,
      reportedCount: reported,
      clickRate: total > 0 ? Math.round((clicked / total) * 100 * 100) / 100 : 0,
      reportRate: total > 0 ? Math.round((reported / total) * 100 * 100) / 100 : 0,
    };
  }

  // ======================== BEHAVIORAL ANALYTICS ========================

  async recordBehaviorEvent(dto: RecordBehaviorEventDto): Promise<BehaviorPatternResponseDto> {
    const pattern = await this.prisma.behaviorPattern.create({
      data: {
        userId: dto.userId,
        tenantId: dto.tenantId,
        patternType: dto.patternType,
        metadata: dto.metadata || {},
      },
    });

    return {
      id: pattern.id,
      userId: pattern.userId,
      tenantId: pattern.tenantId,
      patternType: pattern.patternType as BehaviorEventType,
      metadata: pattern.metadata,
      detectedAt: pattern.detectedAt,
    };
  }

  async getBehaviorPatterns(dto: GetBehaviorPatternsDto) {
    const { page = 1, limit = 50, userId, tenantId, patternType, startDate, endDate } = dto;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (userId) where.userId = userId;
    if (tenantId) where.tenantId = tenantId;
    if (patternType) where.patternType = patternType;
    if (startDate || endDate) {
      where.detectedAt = {};
      if (startDate) where.detectedAt.gte = new Date(startDate);
      if (endDate) where.detectedAt.lte = new Date(endDate);
    }

    const [patterns, total] = await Promise.all([
      this.prisma.behaviorPattern.findMany({
        where,
        skip,
        take: limit,
        orderBy: { detectedAt: 'desc' },
      }),
      this.prisma.behaviorPattern.count({ where }),
    ]);

    return {
      data: patterns.map((p) => ({
        id: p.id,
        userId: p.userId,
        tenantId: p.tenantId,
        patternType: p.patternType as BehaviorEventType,
        metadata: p.metadata,
        detectedAt: p.detectedAt,
      })),
      total,
      page,
      limit,
    };
  }

  async analyzeBehavior(dto: AnalyzeBehaviorDto) {
    const dateFilter = this.getDateFilter(dto.timeRange);

    const patterns = await this.prisma.behaviorPattern.findMany({
      where: {
        userId: dto.userId,
        tenantId: dto.tenantId,
        detectedAt: dateFilter,
      },
      orderBy: { detectedAt: 'desc' },
    });

    const analysis = {
      userId: dto.userId,
      timeRange: dto.timeRange,
      totalEvents: patterns.length,
      eventBreakdown: {} as Record<string, number>,
      anomalies: [] as any[],
      trends: [] as any[],
    };

    // Count events by type
    patterns.forEach((p) => {
      const type = p.patternType;
      analysis.eventBreakdown[type] = (analysis.eventBreakdown[type] || 0) + 1;
    });

    // Detect anomalies
    const avgEventsPerDay = patterns.length / 30;
    if (avgEventsPerDay > 50) {
      analysis.anomalies.push({
        type: 'HIGH_ACTIVITY',
        description: 'Unusually high activity detected',
        severity: 'medium',
      });
    }

    return analysis;
  }

  // ======================== AI RECOMMENDATIONS ========================

  async getRecommendations(dto: GetRecommendationsDto): Promise<RecommendationResponseDto[]> {
    const riskScore = await this.prisma.riskScore.findFirst({
      where: { userId: dto.userId },
      orderBy: { calculatedAt: 'desc' },
    });

    const recommendations: RecommendationResponseDto[] = [];

    // Recommend based on risk score
    if (riskScore && riskScore.phishingScore > 70) {
      recommendations.push({
        id: `rec-phishing-${dto.userId}`,
        title: 'Phishing Awareness Training',
        description: 'Complete advanced phishing identification course',
        reason: 'High phishing risk detected',
        priority: 90,
        type: 'COURSE',
        resourceId: 'course-phishing-advanced',
      });
    }

    // Recommend based on incomplete training
    if (riskScore && riskScore.trainingCompletionScore > 60) {
      recommendations.push({
        id: `rec-training-${dto.userId}`,
        title: 'Complete Required Training',
        description: 'Finish your mandatory security awareness courses',
        reason: 'Training completion below target',
        priority: 80,
        type: 'ACTION',
      });
    }

    return recommendations.slice(0, dto.limit);
  }

  async getTenantRecommendations(dto: GetTenantRecommendationsDto) {
    const overview = await this.getTenantRiskOverview({ tenantId: dto.tenantId });
    const recommendations: RecommendationResponseDto[] = [];

    if (overview.riskDistribution.critical > 0) {
      recommendations.push({
        id: `rec-critical-${dto.tenantId}`,
        title: 'Address Critical Risk Users',
        description: `${overview.riskDistribution.critical} users at critical risk level`,
        reason: 'Critical risk users detected',
        priority: 100,
        type: 'ACTION',
      });
    }

    if (overview.averageRiskScore > 60) {
      recommendations.push({
        id: `rec-training-campaign-${dto.tenantId}`,
        title: 'Launch Training Campaign',
        description: 'Organization-wide security awareness initiative needed',
        reason: 'Average risk score above threshold',
        priority: 85,
        type: 'TRAINING',
      });
    }

    return recommendations.slice(0, dto.limit);
  }

  // ======================== PREDICTIVE ANALYTICS ========================

  async predictRiskTrend(dto: PredictRiskTrendDto) {
    const historicalScores = await this.prisma.riskScore.findMany({
      where: { userId: dto.userId },
      orderBy: { calculatedAt: 'desc' },
      take: 30,
    });

    if (historicalScores.length < 5) {
      return {
        userId: dto.userId,
        prediction: 'INSUFFICIENT_DATA',
        message: 'Not enough historical data for prediction',
      };
    }

    // Simple linear regression
    const avgScore =
      historicalScores.reduce((sum, s) => sum + s.overallScore, 0) / historicalScores.length;
    const trend =
      historicalScores[0].overallScore - historicalScores[historicalScores.length - 1].overallScore;
    const predictedScore = Math.max(
      0,
      Math.min(100, avgScore + (trend / historicalScores.length) * dto.daysAhead),
    );

    return {
      userId: dto.userId,
      currentScore: historicalScores[0].overallScore,
      predictedScore: Math.round(predictedScore * 100) / 100,
      trend: trend > 0 ? 'INCREASING' : 'DECREASING',
      confidence: historicalScores.length > 15 ? 'HIGH' : 'MEDIUM',
      daysAhead: dto.daysAhead,
    };
  }

  async predictCompliance(dto: PredictComplianceDto) {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { course: { tenantId: dto.tenantId } },
      include: { course: true },
    });

    const total = enrollments.length;
    const completed = enrollments.filter((e) => e.status === 'COMPLETED').length;
    const inProgress = enrollments.filter((e) => e.status === 'IN_PROGRESS').length;

    const completionRate = total > 0 ? completed / total : 0;
    const predictedCompletion = completionRate + (inProgress / total) * 0.7;

    return {
      tenantId: dto.tenantId,
      currentComplianceRate: Math.round(completionRate * 100),
      predictedComplianceRate: Math.round(predictedCompletion * 100),
      daysAhead: dto.daysAhead,
      atRiskUsers: total - completed - inProgress,
    };
  }

  // ======================== AUTO-REMEDIATION ========================

  async triggerAutoRemediation(dto: TriggerAutoRemediationDto) {
    this.logger.log(`Triggering auto-remediation for user: ${dto.userId}`);

    // Record the remediation action in audit log
    await this.prisma.auditLog.create({
      data: {
        userId: dto.userId,
        tenantId: dto.tenantId,
        action: 'AUTO_REMEDIATION_TRIGGERED',
        resource: 'USER',
        resourceId: dto.userId,
        metadata: {
          reason: dto.reason,
          ...dto.metadata,
        },
      },
    });

    return {
      userId: dto.userId,
      action: 'TRIGGERED',
      reason: dto.reason,
      timestamp: new Date(),
    };
  }

  async getRemediationActions(dto: GetRemediationActionsDto) {
    const dateFilter = this.getDateFilter(dto.timeRange);
    const where: any = {
      action: 'AUTO_REMEDIATION_TRIGGERED',
      createdAt: dateFilter,
    };
    if (dto.userId) where.userId = dto.userId;
    if (dto.tenantId) where.tenantId = dto.tenantId;

    const actions = await this.prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return actions.map((a) => ({
      id: a.id,
      userId: a.userId,
      tenantId: a.tenantId,
      reason: (a.metadata as any)?.reason,
      timestamp: a.createdAt,
    }));
  }

  // ======================== DASHBOARD & METRICS ========================

  async getDashboardStats(dto: GetDashboardStatsDto) {
    const dateFilter = this.getDateFilter(dto.timeRange);

    const [enrollments, riskScores, phishingEvents] = await Promise.all([
      this.prisma.enrollment.findMany({
        where: {
          course: { tenantId: dto.tenantId },
          createdAt: dateFilter,
        },
      }),
      this.prisma.riskScore.findMany({
        where: {
          tenantId: dto.tenantId,
          calculatedAt: dateFilter,
        },
      }),
      this.prisma.phishingSimulation.findMany({
        where: {
          tenantId: dto.tenantId,
          emailSent: dateFilter,
        },
      }),
    ]);

    const completed = enrollments.filter((e) => e.status === 'COMPLETED').length;
    const avgRisk =
      riskScores.length > 0
        ? riskScores.reduce((sum, s) => sum + s.overallScore, 0) / riskScores.length
        : 0;

    return {
      tenantId: dto.tenantId,
      timeRange: dto.timeRange,
      totalEnrollments: enrollments.length,
      completedCourses: completed,
      completionRate:
        enrollments.length > 0 ? Math.round((completed / enrollments.length) * 100) : 0,
      averageRiskScore: Math.round(avgRisk * 100) / 100,
      phishingSimulations: phishingEvents.length,
      phishingClickRate:
        phishingEvents.length > 0
          ? Math.round(
              (phishingEvents.filter((e) => e.wasClicked).length / phishingEvents.length) * 100,
            )
          : 0,
    };
  }

  async getEngagementMetrics(dto: GetEngagementMetricsDto) {
    const dateFilter = this.getDateFilter(dto.timeRange);
    const where: any = { detectedAt: dateFilter };
    if (dto.tenantId) where.tenantId = dto.tenantId;

    const patterns = await this.prisma.behaviorPattern.findMany({ where });

    const metrics = {
      totalEvents: patterns.length,
      activeUsers: new Set(patterns.map((p) => p.userId)).size,
      eventsByType: {} as Record<string, number>,
      avgEventsPerUser: 0,
    };

    patterns.forEach((p) => {
      const type = p.patternType;
      metrics.eventsByType[type] = (metrics.eventsByType[type] || 0) + 1;
    });

    metrics.avgEventsPerUser =
      metrics.activeUsers > 0
        ? Math.round((metrics.totalEvents / metrics.activeUsers) * 100) / 100
        : 0;

    return metrics;
  }

  async getCompletionRates(dto: GetCompletionRatesDto) {
    const dateFilter = this.getDateFilter(dto.timeRange);
    const where: any = {
      course: { tenantId: dto.tenantId },
      createdAt: dateFilter,
    };
    if (dto.courseId) where.courseId = dto.courseId;

    const enrollments = await this.prisma.enrollment.findMany({
      where,
      include: { course: true },
    });

    const byStatus = {
      NOT_STARTED: 0,
      IN_PROGRESS: 0,
      COMPLETED: 0,
      FAILED: 0,
      EXPIRED: 0,
    };

    enrollments.forEach((e) => {
      byStatus[e.status]++;
    });

    return {
      tenantId: dto.tenantId,
      courseId: dto.courseId,
      total: enrollments.length,
      byStatus,
      completionRate:
        enrollments.length > 0 ? Math.round((byStatus.COMPLETED / enrollments.length) * 100) : 0,
    };
  }

  // ======================== TREND ANALYSIS ========================

  async getRiskTrends(dto: GetRiskTrendsDto) {
    const dateFilter = this.getDateFilter(dto.timeRange);
    const where: any = { calculatedAt: dateFilter };
    if (dto.tenantId) where.tenantId = dto.tenantId;
    if (dto.userId) where.userId = dto.userId;

    const scores = await this.prisma.riskScore.findMany({
      where,
      orderBy: { calculatedAt: 'asc' },
    });

    return {
      timeRange: dto.timeRange,
      dataPoints: scores.map((s) => ({
        date: s.calculatedAt,
        score: s.overallScore,
        userId: s.userId,
      })),
    };
  }

  async getTrainingTrends(dto: GetTrainingTrendsDto) {
    const dateFilter = this.getDateFilter(dto.timeRange);

    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        course: { tenantId: dto.tenantId },
        createdAt: dateFilter,
      },
      orderBy: { createdAt: 'asc' },
    });

    const byDate = {} as Record<string, any>;
    enrollments.forEach((e) => {
      const date = e.createdAt.toISOString().split('T')[0];
      if (!byDate[date]) {
        byDate[date] = { enrollments: 0, completions: 0 };
      }
      byDate[date].enrollments++;
      if (e.status === 'COMPLETED') {
        byDate[date].completions++;
      }
    });

    return {
      tenantId: dto.tenantId,
      timeRange: dto.timeRange,
      trends: Object.entries(byDate).map(([date, data]) => ({
        date,
        ...data,
      })),
    };
  }

  // ======================== HELPER METHODS ========================

  private async calculatePhishingScore(userId: string): Promise<number> {
    const simulations = await this.prisma.phishingSimulation.findMany({
      where: { userId },
      orderBy: { emailSent: 'desc' },
      take: 10,
    });

    if (simulations.length === 0) return 50;

    const clicked = simulations.filter((s) => s.wasClicked).length;
    const reported = simulations.filter((s) => s.wasReported).length;

    return Math.min(100, clicked * 10 - reported * 5 + 50);
  }

  private async calculateTrainingCompletionScore(userId: string): Promise<number> {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { userId },
    });

    if (enrollments.length === 0) return 100;

    const completed = enrollments.filter((e) => e.status === 'COMPLETED').length;
    return Math.max(0, 100 - (completed / enrollments.length) * 100);
  }

  private async calculateTimeSinceTrainingScore(userId: string): Promise<number> {
    const lastCompleted = await this.prisma.enrollment.findFirst({
      where: { userId, status: 'COMPLETED' },
      orderBy: { completedAt: 'desc' },
    });

    if (!lastCompleted?.completedAt) return 100;

    const daysSince = Math.floor(
      (Date.now() - lastCompleted.completedAt.getTime()) / (1000 * 60 * 60 * 24),
    );

    return Math.min(100, (daysSince / 365) * 100);
  }

  private async calculateQuizPerformanceScore(userId: string): Promise<number> {
    const attempts = await this.prisma.quizAttempt.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' },
      take: 10,
    });

    if (attempts.length === 0) return 50;

    const avgScore = attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length;
    return Math.max(0, 100 - avgScore);
  }

  private async calculateSecurityIncidentScore(userId: string): Promise<number> {
    const incidents = await this.prisma.auditLog.count({
      where: {
        userId,
        action: { in: ['SECURITY_INCIDENT', 'POLICY_VIOLATION'] },
      },
    });

    return Math.min(100, incidents * 20);
  }

  private async calculateLoginAnomalyScore(_userId: string): Promise<number> {
    // Simplified - would need more complex anomaly detection
    return 10;
  }

  private determineRiskLevel(score: number): RiskLevel {
    if (score >= 75) return RiskLevel.CRITICAL;
    if (score >= 50) return RiskLevel.HIGH;
    if (score >= 25) return RiskLevel.MEDIUM;
    return RiskLevel.LOW;
  }

  private mapRiskScoreToResponse(score: any): RiskScoreResponseDto {
    return {
      id: score.id,
      userId: score.userId,
      tenantId: score.tenantId,
      overallScore: score.overallScore,
      riskLevel: this.determineRiskLevel(score.overallScore),
      phishingScore: score.phishingScore,
      trainingCompletionScore: score.trainingCompletionScore,
      timeSinceTrainingScore: score.timeSinceTrainingScore,
      quizPerformanceScore: score.quizPerformanceScore,
      securityIncidentScore: score.securityIncidentScore,
      loginAnomalyScore: score.loginAnomalyScore,
      calculatedAt: score.calculatedAt,
    };
  }

  private getDateFilter(timeRange?: TimeRange) {
    const now = new Date();
    switch (timeRange) {
      case TimeRange.LAST_7_DAYS:
        return { gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) };
      case TimeRange.LAST_30_DAYS:
        return { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) };
      case TimeRange.LAST_90_DAYS:
        return { gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) };
      case TimeRange.LAST_YEAR:
        return { gte: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000) };
      default:
        return { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) };
    }
  }
}
