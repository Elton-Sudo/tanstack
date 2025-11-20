import { DatabaseService } from '@app/database';
import { LoggerService } from '@app/logging';
import { EventBusService } from '@app/messaging';
import { Injectable } from '@nestjs/common';

export interface RiskScoreComponents {
  phishingScore: number;
  trainingCompletionScore: number;
  timeSinceTrainingScore: number;
  quizPerformanceScore: number;
  securityIncidentScore: number;
  loginAnomalyScore: number;
}

export interface RiskScoreResult extends RiskScoreComponents {
  overallScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommendations: string[];
}

/**
 * Enhanced Risk Scoring Service
 * Calculates comprehensive cybersecurity risk scores based on:
 * - Phishing simulation performance
 * - Training completion and recency
 * - Quiz performance
 * - Security incidents
 * - Login anomalies
 */
@Injectable()
export class RiskScoringService {
  private readonly WEIGHTS = {
    phishing: 0.25,
    trainingCompletion: 0.2,
    timeSinceTraining: 0.15,
    quizPerformance: 0.2,
    securityIncidents: 0.15,
    loginAnomalies: 0.05,
  };

  constructor(
    private readonly prisma: DatabaseService,
    private readonly logger: LoggerService,
    private readonly eventBus: EventBusService,
  ) {}

  /**
   * Calculate comprehensive risk score for a user
   */
  async calculateUserRiskScore(tenantId: string, userId: string): Promise<RiskScoreResult> {
    const [
      phishingScore,
      trainingCompletionScore,
      timeSinceTrainingScore,
      quizPerformanceScore,
      securityIncidentScore,
      loginAnomalyScore,
    ] = await Promise.all([
      this.calculatePhishingScore(tenantId, userId),
      this.calculateTrainingCompletionScore(tenantId, userId),
      this.calculateTimeSinceTrainingScore(tenantId, userId),
      this.calculateQuizPerformanceScore(tenantId, userId),
      this.calculateSecurityIncidentScore(tenantId, userId),
      this.calculateLoginAnomalyScore(tenantId, userId),
    ]);

    // Calculate weighted overall score (0-100, where 100 is lowest risk)
    const overallScore =
      phishingScore * this.WEIGHTS.phishing +
      trainingCompletionScore * this.WEIGHTS.trainingCompletion +
      timeSinceTrainingScore * this.WEIGHTS.timeSinceTraining +
      quizPerformanceScore * this.WEIGHTS.quizPerformance +
      securityIncidentScore * this.WEIGHTS.securityIncidents +
      loginAnomalyScore * this.WEIGHTS.loginAnomalies;

    const riskLevel = this.determineRiskLevel(overallScore);
    const recommendations = this.generateRecommendations({
      phishingScore,
      trainingCompletionScore,
      timeSinceTrainingScore,
      quizPerformanceScore,
      securityIncidentScore,
      loginAnomalyScore,
      overallScore,
      riskLevel,
    } as RiskScoreResult);

    // Store the risk score
    await this.storeRiskScore(tenantId, userId, {
      overallScore,
      phishingScore,
      trainingCompletionScore,
      timeSinceTrainingScore,
      quizPerformanceScore,
      securityIncidentScore,
      loginAnomalyScore,
    });

    return {
      overallScore: Math.round(overallScore * 100) / 100,
      phishingScore: Math.round(phishingScore * 100) / 100,
      trainingCompletionScore: Math.round(trainingCompletionScore * 100) / 100,
      timeSinceTrainingScore: Math.round(timeSinceTrainingScore * 100) / 100,
      quizPerformanceScore: Math.round(quizPerformanceScore * 100) / 100,
      securityIncidentScore: Math.round(securityIncidentScore * 100) / 100,
      loginAnomalyScore: Math.round(loginAnomalyScore * 100) / 100,
      riskLevel,
      recommendations,
    };
  }

  /**
   * Calculate phishing simulation performance score
   * Higher score = better performance = lower risk
   */
  private async calculatePhishingScore(tenantId: string, userId: string): Promise<number> {
    const events = await this.prisma.phishingEvent.findMany({
      where: { tenantId, userId },
      orderBy: { sentAt: 'desc' },
      take: 20, // Last 20 simulations
    });

    if (events.length === 0) {
      return 50; // Neutral score if no data
    }

    const clicked = events.filter((e) => e.clicked).length;
    const reported = events.filter((e) => e.reported).length;

    // Score calculation:
    // - Start at 100
    // - Subtract 5 points per click
    // - Add 3 points per report
    const score = 100 - (clicked / events.length) * 50 + (reported / events.length) * 30;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate training completion score
   * Higher completion rate = higher score = lower risk
   */
  private async calculateTrainingCompletionScore(
    tenantId: string,
    userId: string,
  ): Promise<number> {
    const [totalEnrollments, completedEnrollments] = await Promise.all([
      this.prisma.enrollment.count({
        where: { tenantId, userId },
      }),
      this.prisma.enrollment.count({
        where: { tenantId, userId, status: 'COMPLETED' },
      }),
    ]);

    if (totalEnrollments === 0) {
      return 0; // No training = high risk
    }

    const completionRate = (completedEnrollments / totalEnrollments) * 100;
    return completionRate; // Direct mapping: 100% completion = 100 score
  }

  /**
   * Calculate time since last training score
   * More recent training = higher score = lower risk
   */
  private async calculateTimeSinceTrainingScore(tenantId: string, userId: string): Promise<number> {
    const lastCompletion = await this.prisma.enrollment.findFirst({
      where: {
        tenantId,
        userId,
        status: 'COMPLETED',
        completedAt: { not: null },
      },
      orderBy: { completedAt: 'desc' },
    });

    if (!lastCompletion || !lastCompletion.completedAt) {
      return 0; // No training completed = high risk
    }

    const daysSinceTraining = Math.floor(
      (Date.now() - lastCompletion.completedAt.getTime()) / (1000 * 60 * 60 * 24),
    );

    // Score decay over time
    // 0-30 days: 100 points
    // 31-90 days: 90-70 points
    // 91-180 days: 70-40 points
    // 181-365 days: 40-20 points
    // 365+ days: 20-0 points

    if (daysSinceTraining <= 30) return 100;
    if (daysSinceTraining <= 90) return 90 - ((daysSinceTraining - 30) / 60) * 20;
    if (daysSinceTraining <= 180) return 70 - ((daysSinceTraining - 90) / 90) * 30;
    if (daysSinceTraining <= 365) return 40 - ((daysSinceTraining - 180) / 185) * 20;
    return Math.max(0, 20 - ((daysSinceTraining - 365) / 365) * 20);
  }

  /**
   * Calculate quiz performance score
   * Higher quiz scores = higher score = lower risk
   */
  private async calculateQuizPerformanceScore(tenantId: string, userId: string): Promise<number> {
    const attempts = await this.prisma.quizAttempt.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' },
      take: 10, // Last 10 attempts
    });

    if (attempts.length === 0) {
      return 50; // Neutral if no quiz data
    }

    const averageScore =
      attempts.reduce((sum, attempt) => sum + attempt.score, 0) / attempts.length;
    const passingRate = (attempts.filter((a) => a.isPassing).length / attempts.length) * 100;

    // Combine average score and passing rate
    return (averageScore + passingRate) / 2;
  }

  /**
   * Calculate security incident score
   * Fewer incidents = higher score = lower risk
   */
  private async calculateSecurityIncidentScore(tenantId: string, userId: string): Promise<number> {
    // Check audit logs for security-related incidents
    const incidents = await this.prisma.auditLog.count({
      where: {
        tenantId,
        userId,
        action: {
          in: [
            'SECURITY_VIOLATION',
            'UNAUTHORIZED_ACCESS',
            'DATA_BREACH',
            'MALWARE_DETECTED',
            'SUSPICIOUS_ACTIVITY',
          ],
        },
        createdAt: {
          gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // Last 90 days
        },
      },
    });

    // Score decreases with more incidents
    // 0 incidents: 100 points
    // 1 incident: 85 points
    // 2 incidents: 70 points
    // 3+ incidents: 50 points or less

    if (incidents === 0) return 100;
    if (incidents === 1) return 85;
    if (incidents === 2) return 70;
    return Math.max(0, 70 - (incidents - 2) * 10);
  }

  /**
   * Calculate login anomaly score
   * Fewer anomalies = higher score = lower risk
   */
  private async calculateLoginAnomalyScore(tenantId: string, userId: string): Promise<number> {
    const recentLogins = await this.prisma.session.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    if (recentLogins.length < 10) {
      return 80; // Not enough data, assume moderate risk
    }

    // Analyze for anomalies
    let anomalyCount = 0;

    // Check for unusual login times (outside 6 AM - 10 PM)
    const unusualTimeLogins = recentLogins.filter((session) => {
      const hour = session.createdAt.getHours();
      return hour < 6 || hour > 22;
    });
    if (unusualTimeLogins.length > recentLogins.length * 0.3) anomalyCount++;

    // Check for multiple IP addresses (potential account sharing)
    const uniqueIPs = new Set(recentLogins.map((s) => s.ipAddress)).size;
    if (uniqueIPs > 5) anomalyCount++;

    // Check for failed login attempts
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { failedAttempts: true },
    });
    if (user && user.failedAttempts > 3) anomalyCount++;

    // Score based on anomaly count
    return Math.max(0, 100 - anomalyCount * 15);
  }

  /**
   * Determine risk level from overall score
   */
  private determineRiskLevel(score: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (score >= 80) return 'LOW';
    if (score >= 60) return 'MEDIUM';
    if (score >= 40) return 'HIGH';
    return 'CRITICAL';
  }

  /**
   * Generate personalized recommendations
   */
  private generateRecommendations(riskScore: RiskScoreResult): string[] {
    const recommendations: string[] = [];

    if (riskScore.phishingScore < 60) {
      recommendations.push(
        'Complete additional phishing awareness training',
        'Review email security best practices from Chapter 3',
      );
    }

    if (riskScore.trainingCompletionScore < 70) {
      recommendations.push(
        'Complete pending cybersecurity training courses',
        'Aim for 100% training completion to reduce risk',
      );
    }

    if (riskScore.timeSinceTrainingScore < 50) {
      recommendations.push(
        'Training is overdue - enroll in refresher courses',
        'Schedule annual cybersecurity awareness training',
      );
    }

    if (riskScore.quizPerformanceScore < 70) {
      recommendations.push(
        'Review quiz materials and retake assessments',
        'Focus on areas where quiz scores are lowest',
      );
    }

    if (riskScore.securityIncidentScore < 80) {
      recommendations.push(
        'Review recent security incidents and lessons learned',
        'Meet with security team to discuss incident prevention',
      );
    }

    if (riskScore.loginAnomalyScore < 70) {
      recommendations.push(
        'Review login activity for unauthorized access',
        'Enable multi-factor authentication if not already active',
        "Ensure you're following login best practices",
      );
    }

    if (riskScore.riskLevel === 'CRITICAL') {
      recommendations.unshift(
        '⚠️ CRITICAL: Immediate security training required',
        'Schedule meeting with Information Security Officer',
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        '✓ Excellent security posture - keep up the good work!',
        'Continue annual training to maintain low risk level',
      );
    }

    return recommendations;
  }

  /**
   * Store risk score in database
   */
  private async storeRiskScore(tenantId: string, userId: string, scores: RiskScoreComponents) {
    await this.prisma.riskScore.create({
      data: {
        tenantId,
        userId,
        ...scores,
        calculatedAt: new Date(),
      },
    });
  }

  /**
   * Get risk score history for a user
   */
  async getUserRiskScoreHistory(tenantId: string, userId: string, limit: number = 10) {
    return await this.prisma.riskScore.findMany({
      where: { tenantId, userId },
      orderBy: { calculatedAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Get high-risk users in tenant
   */
  async getHighRiskUsers(tenantId: string, threshold: number = 40, limit: number = 50) {
    // Get most recent risk score for each user
    const allScores = await this.prisma.riskScore.findMany({
      where: { tenantId },
      orderBy: { calculatedAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            department: true,
            departmentId: true,
          },
        },
      },
    });

    // Get latest score for each user
    const latestScores = new Map<string, any>();
    allScores.forEach((score) => {
      if (
        !latestScores.has(score.userId) ||
        score.calculatedAt > latestScores.get(score.userId).calculatedAt
      ) {
        latestScores.set(score.userId, score);
      }
    });

    // Filter and sort by risk
    const highRisk = Array.from(latestScores.values())
      .filter((score) => score.overallScore < threshold)
      .sort((a, b) => a.overallScore - b.overallScore)
      .slice(0, limit);

    return highRisk;
  }

  /**
   * Calculate tenant-wide risk statistics
   */
  async getTenantRiskStats(tenantId: string) {
    const allUsers = await this.prisma.user.findMany({
      where: { tenantId },
      select: { id: true },
    });

    const latestScores = await Promise.all(
      allUsers.map(async (user) => {
        const score = await this.prisma.riskScore.findFirst({
          where: { tenantId, userId: user.id },
          orderBy: { calculatedAt: 'desc' },
        });
        return score;
      }),
    );

    const validScores = latestScores.filter((s) => s !== null) as any[];

    if (validScores.length === 0) {
      return {
        totalUsers: allUsers.length,
        usersAssessed: 0,
        averageRiskScore: 0,
        lowRisk: 0,
        mediumRisk: 0,
        highRisk: 0,
        criticalRisk: 0,
      };
    }

    const avgScore = validScores.reduce((sum, s) => sum + s.overallScore, 0) / validScores.length;

    const lowRisk = validScores.filter((s) => s.overallScore >= 80).length;
    const mediumRisk = validScores.filter(
      (s) => s.overallScore >= 60 && s.overallScore < 80,
    ).length;
    const highRisk = validScores.filter((s) => s.overallScore >= 40 && s.overallScore < 60).length;
    const criticalRisk = validScores.filter((s) => s.overallScore < 40).length;

    return {
      totalUsers: allUsers.length,
      usersAssessed: validScores.length,
      averageRiskScore: Math.round(avgScore * 100) / 100,
      lowRisk,
      mediumRisk,
      highRisk,
      criticalRisk,
    };
  }

  /**
   * Bulk calculate risk scores for all users in tenant
   */
  async bulkCalculateRiskScores(tenantId: string): Promise<number> {
    const users = await this.prisma.user.findMany({
      where: { tenantId },
      select: { id: true },
    });

    let calculatedCount = 0;

    for (const user of users) {
      try {
        await this.calculateUserRiskScore(tenantId, user.id);
        calculatedCount++;
      } catch (error) {
        this.logger.error(
          `Failed to calculate risk score for user ${user.id}: ${error.message}`,
          error.stack,
          'RiskScoringService',
        );
      }
    }

    this.logger.log(
      `Bulk risk score calculation completed: ${calculatedCount}/${users.length}`,
      'RiskScoringService',
    );

    return calculatedCount;
  }
}
