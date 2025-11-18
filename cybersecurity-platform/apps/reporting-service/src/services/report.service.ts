import { DatabaseService } from '@app/database';
import { LoggerService } from '@app/logging';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  ComplianceFramework,
  ComplianceMetricsDto,
  ComplianceReportDto,
  CustomReportDto,
  DashboardMetricsDto,
  DashboardMetricsResponseDto,
  GenerateReportDto,
  ReportResponseDto,
  ReportScheduleDto,
  ReportScheduleResponseDto,
  ReportStatus,
  ReportTemplateDto,
  ReportTemplateResponseDto,
  ReportType,
  UpdateReportScheduleDto,
} from '../dto/report.dto';
import { ReportGeneratorService } from './report-generator.service';
import { ReportSchedulerService } from './report-scheduler.service';

@Injectable()
export class ReportService {
  constructor(
    private readonly database: DatabaseService,
    private readonly logger: LoggerService,
    private readonly reportGenerator: ReportGeneratorService,
    private readonly reportScheduler: ReportSchedulerService,
  ) {}

  // Generate Reports
  async generateReport(
    tenantId: string,
    userId: string,
    dto: GenerateReportDto,
  ): Promise<ReportResponseDto> {
    try {
      // Create report record
      const report = await this.database.report.create({
        data: {
          tenantId,
          type: dto.type,
          title: dto.title,
          description: dto.description || '',
          format: dto.format,
          status: ReportStatus.PENDING,
          filters: dto.filters ? JSON.parse(JSON.stringify(dto.filters)) : {},
          metadata: {
            includeCharts: dto.includeCharts,
            includeRawData: dto.includeRawData,
          },
          generatedBy: userId,
        },
      });

      // Generate report asynchronously
      this.generateReportAsync(report.id, tenantId, dto).catch((error) => {
        this.logger.error(`Failed to generate report ${report.id}`, error);
      });

      return this.mapReportToResponse(report);
    } catch (error) {
      this.logger.error('Failed to initiate report generation', error);
      throw error;
    }
  }

  private async generateReportAsync(
    reportId: string,
    tenantId: string,
    dto: GenerateReportDto,
  ): Promise<void> {
    try {
      await this.database.report.update({
        where: { id: reportId },
        data: { status: ReportStatus.GENERATING },
      });

      let fileUrl: string;
      let fileSize: number;

      switch (dto.type) {
        case ReportType.EXECUTIVE_DASHBOARD:
          ({ fileUrl, fileSize } = await this.reportGenerator.generateExecutiveDashboard(
            tenantId,
            dto,
          ));
          break;
        case ReportType.USER_PROGRESS:
          ({ fileUrl, fileSize } = await this.reportGenerator.generateUserProgressReport(
            tenantId,
            dto,
          ));
          break;
        case ReportType.PHISHING_SIMULATION:
          ({ fileUrl, fileSize } = await this.reportGenerator.generatePhishingReport(
            tenantId,
            dto,
          ));
          break;
        case ReportType.RISK_ASSESSMENT:
          ({ fileUrl, fileSize } = await this.reportGenerator.generateRiskAssessmentReport(
            tenantId,
            dto,
          ));
          break;
        case ReportType.TRAINING_EFFECTIVENESS:
          ({ fileUrl, fileSize } = await this.reportGenerator.generateTrainingEffectivenessReport(
            tenantId,
            dto,
          ));
          break;
        case ReportType.DEPARTMENT_PERFORMANCE:
          ({ fileUrl, fileSize } = await this.reportGenerator.generateDepartmentPerformanceReport(
            tenantId,
            dto,
          ));
          break;
        default:
          throw new BadRequestException('Unsupported report type');
      }

      await this.database.report.update({
        where: { id: reportId },
        data: {
          status: ReportStatus.COMPLETED,
          fileUrl,
          fileSize,
          generatedAt: new Date(),
        },
      });
    } catch (error) {
      await this.database.report.update({
        where: { id: reportId },
        data: {
          status: ReportStatus.FAILED,
          metadata: { error: error.message },
        },
      });
      throw error;
    }
  }

  async generateComplianceReport(
    tenantId: string,
    userId: string,
    dto: ComplianceReportDto,
  ): Promise<ReportResponseDto> {
    try {
      const report = await this.database.report.create({
        data: {
          tenantId,
          type: ReportType.COMPLIANCE_REPORT,
          title: dto.title,
          description: dto.description || '',
          format: dto.format,
          status: ReportStatus.PENDING,
          filters: JSON.parse(
            JSON.stringify({ dateRange: dto.dateRange, framework: dto.framework }),
          ),
          metadata: {
            includeEvidence: dto.includeEvidence,
            includeRecommendations: dto.includeRecommendations,
          },
          generatedBy: userId,
        },
      });

      this.generateComplianceReportAsync(report.id, tenantId, dto).catch((error) => {
        this.logger.error(`Failed to generate compliance report ${report.id}`, error);
      });

      return this.mapReportToResponse(report);
    } catch (error) {
      this.logger.error('Failed to initiate compliance report generation', error);
      throw error;
    }
  }

  private async generateComplianceReportAsync(
    reportId: string,
    tenantId: string,
    dto: ComplianceReportDto,
  ): Promise<void> {
    try {
      await this.database.report.update({
        where: { id: reportId },
        data: { status: ReportStatus.GENERATING },
      });

      const { fileUrl, fileSize } = await this.reportGenerator.generateComplianceReport(
        tenantId,
        dto,
      );

      await this.database.report.update({
        where: { id: reportId },
        data: {
          status: ReportStatus.COMPLETED,
          fileUrl,
          fileSize,
          generatedAt: new Date(),
        },
      });
    } catch (error) {
      await this.database.report.update({
        where: { id: reportId },
        data: {
          status: ReportStatus.FAILED,
          metadata: { error: error.message },
        },
      });
      throw error;
    }
  }

  async generateCustomReport(
    tenantId: string,
    userId: string,
    dto: CustomReportDto,
  ): Promise<ReportResponseDto> {
    try {
      const report = await this.database.report.create({
        data: {
          tenantId,
          type: ReportType.CUSTOM,
          title: dto.title,
          description: dto.description || '',
          format: dto.format,
          status: ReportStatus.PENDING,
          filters: dto.filters ? JSON.parse(JSON.stringify(dto.filters)) : {},
          metadata: JSON.parse(
            JSON.stringify({
              columns: dto.columns,
              dataSource: dto.dataSource,
              groupBy: dto.groupBy,
              orderBy: dto.orderBy,
            }),
          ),
          generatedBy: userId,
        },
      });
      this.generateCustomReportAsync(report.id, tenantId, dto).catch((error) => {
        this.logger.error(`Failed to generate custom report ${report.id}`, error);
      });

      return this.mapReportToResponse(report);
    } catch (error) {
      this.logger.error('Failed to initiate custom report generation', error);
      throw error;
    }
  }

  private async generateCustomReportAsync(
    reportId: string,
    tenantId: string,
    dto: CustomReportDto,
  ): Promise<void> {
    try {
      await this.database.report.update({
        where: { id: reportId },
        data: { status: ReportStatus.GENERATING },
      });

      const { fileUrl, fileSize } = await this.reportGenerator.generateCustomReport(tenantId, dto);

      await this.database.report.update({
        where: { id: reportId },
        data: {
          status: ReportStatus.COMPLETED,
          fileUrl,
          fileSize,
          generatedAt: new Date(),
        },
      });
    } catch (error) {
      await this.database.report.update({
        where: { id: reportId },
        data: {
          status: ReportStatus.FAILED,
          metadata: { error: error.message },
        },
      });
      throw error;
    }
  }

  // Dashboard Metrics
  async getExecutiveDashboard(
    tenantId: string,
    dto: DashboardMetricsDto,
  ): Promise<DashboardMetricsResponseDto> {
    try {
      const dateFilter = dto.dateRange
        ? {
            gte: dto.dateRange.startDate,
            lte: dto.dateRange.endDate,
          }
        : undefined;

      // Total users
      const totalUsers = await this.database.user.count({
        where: {
          tenantId,
          departmentId: dto.departmentIds ? { in: dto.departmentIds } : undefined,
        },
      });

      // Active users (logged in within last 30 days)
      const activeUsers = await this.database.user.count({
        where: {
          tenantId,
          departmentId: dto.departmentIds ? { in: dto.departmentIds } : undefined,
          lastLoginAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      });

      // Course metrics
      const totalCourses = await this.database.course.count({
        where: { tenantId, isActive: true },
      });

      // Enrollment metrics
      const completedEnrollments = await this.database.enrollment.count({
        where: {
          tenantId,
          status: 'COMPLETED',
          userId: dto.departmentIds
            ? {
                in: await this.database.user
                  .findMany({
                    where: { tenantId, departmentId: { in: dto.departmentIds } },
                    select: { id: true },
                  })
                  .then((users) => users.map((u) => u.id)),
              }
            : undefined,
          completedAt: dateFilter,
        },
      });

      const totalEnrollments = await this.database.enrollment.count({
        where: {
          tenantId,
          userId: dto.departmentIds
            ? {
                in: await this.database.user
                  .findMany({
                    where: { tenantId, departmentId: { in: dto.departmentIds } },
                    select: { id: true },
                  })
                  .then((users) => users.map((u) => u.id)),
              }
            : undefined,
        },
      });

      const averageCompletionRate =
        totalEnrollments > 0 ? (completedEnrollments / totalEnrollments) * 100 : 0;

      // Risk metrics
      const riskScores = await this.database.riskScore.findMany({
        where: {
          tenantId,
          userId: dto.departmentIds
            ? {
                in: await this.database.user
                  .findMany({
                    where: { tenantId, departmentId: { in: dto.departmentIds } },
                    select: { id: true },
                  })
                  .then((users) => users.map((u) => u.id)),
              }
            : undefined,
          calculatedAt: dateFilter,
        },
        select: { overallScore: true },
      });

      const averageRiskScore =
        riskScores.length > 0
          ? riskScores.reduce((sum, r) => sum + r.overallScore, 0) / riskScores.length
          : 0;

      const highRiskUsers = riskScores.filter((r) => r.overallScore >= 70).length;

      // Phishing metrics
      const phishingSimulations = await this.database.phishingEvent.count({
        where: {
          tenantId,
          userId: dto.departmentIds
            ? {
                in: await this.database.user
                  .findMany({
                    where: { tenantId, departmentId: { in: dto.departmentIds } },
                    select: { id: true },
                  })
                  .then((users) => users.map((u) => u.id)),
              }
            : undefined,
          sentAt: dateFilter,
        },
      });

      const phishingClicks = await this.database.phishingEvent.count({
        where: {
          tenantId,
          clicked: true,
          userId: dto.departmentIds
            ? {
                in: await this.database.user
                  .findMany({
                    where: { tenantId, departmentId: { in: dto.departmentIds } },
                    select: { id: true },
                  })
                  .then((users) => users.map((u) => u.id)),
              }
            : undefined,
          sentAt: dateFilter,
        },
      });

      const phishingClickRate =
        phishingSimulations > 0 ? (phishingClicks / phishingSimulations) * 100 : 0;

      // Training hours
      const enrollments = await this.database.enrollment.findMany({
        where: {
          tenantId,
          status: 'COMPLETED',
          userId: dto.departmentIds
            ? {
                in: await this.database.user
                  .findMany({
                    where: { tenantId, departmentId: { in: dto.departmentIds } },
                    select: { id: true },
                  })
                  .then((users) => users.map((u) => u.id)),
              }
            : undefined,
          completedAt: dateFilter,
        },
        include: { course: true },
      });

      const trainingHours =
        enrollments.reduce((sum, e) => sum + (e.course.durationMinutes || 0), 0) / 60;

      // Certificates
      const certificatesIssued = await this.database.certificate.count({
        where: {
          tenantId,
          userId: dto.departmentIds
            ? {
                in: await this.database.user
                  .findMany({
                    where: { tenantId, departmentId: { in: dto.departmentIds } },
                    select: { id: true },
                  })
                  .then((users) => users.map((u) => u.id)),
              }
            : undefined,
          issuedAt: dateFilter,
        },
      });

      // Department metrics
      const departmentMetrics = await this.getDepartmentMetrics(tenantId, dto.departmentIds);

      // Trend data
      const trendData = await this.getTrendData(tenantId, dto);

      // Top/bottom performers
      const topPerformers = await this.getTopPerformers(tenantId, dto.departmentIds, 10);
      const bottomPerformers = await this.getBottomPerformers(tenantId, dto.departmentIds, 10);

      return {
        totalUsers,
        activeUsers,
        totalCourses,
        completedEnrollments,
        averageCompletionRate: Math.round(averageCompletionRate * 100) / 100,
        averageRiskScore: Math.round(averageRiskScore * 100) / 100,
        highRiskUsers,
        phishingSimulationsSent: phishingSimulations,
        phishingClickRate: Math.round(phishingClickRate * 100) / 100,
        complianceRate: 100 - Math.round(phishingClickRate * 100) / 100,
        trainingHours: Math.round(trainingHours * 100) / 100,
        certificatesIssued,
        departmentMetrics,
        trendData,
        topPerformers,
        bottomPerformers,
      };
    } catch (error) {
      this.logger.error('Failed to get executive dashboard metrics', error);
      throw error;
    }
  }

  private async getDepartmentMetrics(tenantId: string, departmentIds?: string[]): Promise<any[]> {
    const departments = await this.database.department.findMany({
      where: {
        tenantId,
        id: departmentIds ? { in: departmentIds } : undefined,
      },
    });

    const metrics = await Promise.all(
      departments.map(async (dept) => {
        const userCount = await this.database.user.count({
          where: { tenantId, departmentId: dept.id },
        });

        const completedEnrollments = await this.database.enrollment.count({
          where: {
            tenantId,
            status: 'COMPLETED',
            userId: {
              in: await this.database.user
                .findMany({
                  where: { tenantId, departmentId: dept.id },
                  select: { id: true },
                })
                .then((users) => users.map((u) => u.id)),
            },
          },
        });

        const totalEnrollments = await this.database.enrollment.count({
          where: {
            tenantId,
            userId: {
              in: await this.database.user
                .findMany({
                  where: { tenantId, departmentId: dept.id },
                  select: { id: true },
                })
                .then((users) => users.map((u) => u.id)),
            },
          },
        });

        const completionRate =
          totalEnrollments > 0 ? (completedEnrollments / totalEnrollments) * 100 : 0;

        return {
          departmentId: dept.id,
          departmentName: dept.name,
          userCount,
          completedEnrollments,
          totalEnrollments,
          completionRate: Math.round(completionRate * 100) / 100,
        };
      }),
    );

    return metrics;
  }

  private async getTrendData(tenantId: string, _dto: DashboardMetricsDto): Promise<any> {
    // Generate trend data for the last 12 months
    const months = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        month: date.toISOString().slice(0, 7),
        enrollments: 0,
        completions: 0,
        riskScore: 0,
      });
    }

    // Populate with actual data
    for (const month of months) {
      const startDate = new Date(month.month);
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

      month.enrollments = await this.database.enrollment.count({
        where: {
          tenantId,
          createdAt: { gte: startDate, lte: endDate },
        },
      });

      month.completions = await this.database.enrollment.count({
        where: {
          tenantId,
          status: 'COMPLETED',
          completedAt: { gte: startDate, lte: endDate },
        },
      });

      const riskScores = await this.database.riskScore.findMany({
        where: {
          tenantId,
          calculatedAt: { gte: startDate, lte: endDate },
        },
        select: { overallScore: true },
      });

      month.riskScore =
        riskScores.length > 0
          ? Math.round(
              (riskScores.reduce((sum, r) => sum + r.overallScore, 0) / riskScores.length) * 100,
            ) / 100
          : 0;
    }

    return { months };
  }

  private async getTopPerformers(
    tenantId: string,
    departmentIds?: string[],
    limit: number = 10,
  ): Promise<any[]> {
    const users = await this.database.user.findMany({
      where: {
        tenantId,
        departmentId: departmentIds ? { in: departmentIds } : undefined,
      },
      include: {
        enrollments: {
          where: { status: 'COMPLETED' },
        },
        certificates: true,
      },
      take: 1000, // Limit initial fetch
    });

    const performers = users.map((user) => ({
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      completedCourses: user.enrollments.length,
      certificates: user.certificates.length,
      score: user.enrollments.length * 10 + user.certificates.length * 5,
    }));

    return performers.sort((a, b) => b.score - a.score).slice(0, limit);
  }

  private async getBottomPerformers(
    tenantId: string,
    departmentIds?: string[],
    limit: number = 10,
  ): Promise<any[]> {
    const users = await this.database.user.findMany({
      where: {
        tenantId,
        departmentId: departmentIds ? { in: departmentIds } : undefined,
      },
      include: {
        enrollments: {
          where: { status: 'COMPLETED' },
        },
        certificates: true,
      },
      take: 1000,
    });

    const performers = users.map((user) => ({
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      completedCourses: user.enrollments.length,
      certificates: user.certificates.length,
      score: user.enrollments.length * 10 + user.certificates.length * 5,
    }));

    return performers.sort((a, b) => a.score - b.score).slice(0, limit);
  }

  async getComplianceMetrics(
    tenantId: string,
    framework: ComplianceFramework,
  ): Promise<ComplianceMetricsDto> {
    try {
      // Get compliance requirements for framework
      const requirements = await this.getComplianceRequirements(framework);

      // Get total users
      const totalUsers = await this.database.user.count({ where: { tenantId } });

      // Calculate compliance
      const compliantUsers = await this.calculateCompliantUsers(tenantId, framework, requirements);
      const nonCompliantUsers = totalUsers - compliantUsers;

      // Training metrics
      const requiredTrainings = requirements.length * totalUsers;
      const completedTrainings = await this.database.enrollment.count({
        where: {
          tenantId,
          status: 'COMPLETED',
          course: {
            complianceFrameworks: {
              has: framework,
            },
          },
        },
      });

      const activeEnrollments = await this.database.enrollment.count({
        where: {
          tenantId,
          status: 'IN_PROGRESS',
          course: {
            complianceFrameworks: {
              has: framework,
            },
          },
        },
      });

      const overdueTrainings = await this.database.enrollment.count({
        where: {
          tenantId,
          status: 'IN_PROGRESS',
          dueDate: { lt: new Date() },
          course: {
            complianceFrameworks: {
              has: framework,
            },
          },
        },
      });

      // Controls assessment
      const controlsAssessed = requirements.length;
      const controlsPassed = Math.floor(controlsAssessed * (compliantUsers / totalUsers));
      const controlsFailed = controlsAssessed - controlsPassed;

      // Audit dates
      const lastAuditDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000); // 90 days ago
      const nextAuditDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 days from now

      // Findings and recommendations
      const findings = await this.getComplianceFindings(tenantId, framework);
      const recommendations = await this.getComplianceRecommendations(tenantId, framework);
      const evidence = await this.getComplianceEvidence(tenantId, framework);

      return {
        framework,
        overallCompliance: Math.round((compliantUsers / totalUsers) * 100),
        compliantUsers,
        nonCompliantUsers,
        requiredTrainings,
        completedTrainings,
        pendingTrainings: activeEnrollments,
        overdueTrainings,
        controlsAssessed,
        controlsPassed,
        controlsFailed,
        lastAuditDate,
        nextAuditDate,
        findings,
        recommendations,
        evidence,
      };
    } catch (error) {
      this.logger.error('Failed to get compliance metrics', error);
      throw error;
    }
  }

  private getComplianceRequirements(_framework: ComplianceFramework): any[] {
    // Mock compliance requirements - in production, load from database
    return [
      { id: '1', name: 'Security Awareness Training', required: true },
      { id: '2', name: 'Data Protection Training', required: true },
      { id: '3', name: 'Incident Response Training', required: true },
      { id: '4', name: 'Password Policy Training', required: true },
      { id: '5', name: 'Phishing Awareness', required: true },
    ];
  }

  private async calculateCompliantUsers(
    tenantId: string,
    _framework: ComplianceFramework,
    requirements: any[],
  ): Promise<number> {
    const users = await this.database.user.findMany({
      where: { tenantId },
      include: {
        enrollments: {
          where: { status: 'COMPLETED' },
          include: { course: true },
        },
      },
    });

    let compliantCount = 0;
    for (const user of users) {
      const completedRequirements = user.enrollments.filter((e) =>
        requirements.some((r) => r.id === e.course.id),
      );
      if (completedRequirements.length >= requirements.length) {
        compliantCount++;
      }
    }

    return compliantCount;
  }

  private async getComplianceFindings(
    _tenantId: string,
    _framework: ComplianceFramework,
  ): Promise<any[]> {
    // Mock findings - in production, analyze actual compliance data
    return [
      {
        id: '1',
        severity: 'HIGH',
        title: 'Incomplete Security Awareness Training',
        description: '15% of users have not completed mandatory security awareness training',
        affectedUsers: 45,
      },
      {
        id: '2',
        severity: 'MEDIUM',
        title: 'Overdue Training Renewals',
        description: 'Annual training renewals are overdue for 23 users',
        affectedUsers: 23,
      },
    ];
  }

  private async getComplianceRecommendations(
    _tenantId: string,
    _framework: ComplianceFramework,
  ): Promise<string[]> {
    return [
      'Schedule mandatory training sessions for non-compliant users',
      'Implement automated reminders for training renewals',
      'Conduct quarterly compliance audits',
      'Enhance phishing simulation programs',
      'Document all training completion records',
    ];
  }

  private async getComplianceEvidence(
    _tenantId: string,
    _framework: ComplianceFramework,
  ): Promise<any[]> {
    return [
      {
        type: 'TRAINING_RECORDS',
        count: 1250,
        lastUpdated: new Date(),
      },
      {
        type: 'CERTIFICATES',
        count: 987,
        lastUpdated: new Date(),
      },
      {
        type: 'AUDIT_LOGS',
        count: 5432,
        lastUpdated: new Date(),
      },
    ];
  }

  // Report Schedules
  async createReportSchedule(
    tenantId: string,
    userId: string,
    dto: ReportScheduleDto,
  ): Promise<ReportScheduleResponseDto> {
    try {
      const nextRunAt = this.reportScheduler.calculateNextRun(dto);

      const schedule = await this.database.reportSchedule.create({
        data: {
          tenantId,
          name: dto.name,
          description: dto.description || '',
          reportType: dto.reportType,
          format: dto.format,
          frequency: dto.frequency,
          dayOfWeek: dto.dayOfWeek ? this.getDayOfWeekNumber(dto.dayOfWeek) : null,
          dayOfMonth: dto.dayOfMonth,
          time: dto.time,
          recipients: dto.recipients,
          filters: dto.filters ? JSON.parse(JSON.stringify(dto.filters)) : {},
          enabled: dto.enabled !== false,
          nextRunAt,
          createdBy: userId,
        },
      });

      return this.mapScheduleToResponse(schedule);
    } catch (error) {
      this.logger.error('Failed to create report schedule', error);
      throw error;
    }
  }

  async getReportSchedules(tenantId: string): Promise<ReportScheduleResponseDto[]> {
    const schedules = await this.database.reportSchedule.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });

    return schedules.map((s) => this.mapScheduleToResponse(s));
  }

  async getReportSchedule(
    tenantId: string,
    scheduleId: string,
  ): Promise<ReportScheduleResponseDto> {
    const schedule = await this.database.reportSchedule.findUnique({
      where: { id: scheduleId, tenantId },
    });

    if (!schedule) {
      throw new NotFoundException('Report schedule not found');
    }

    return this.mapScheduleToResponse(schedule);
  }

  async updateReportSchedule(
    tenantId: string,
    scheduleId: string,
    dto: UpdateReportScheduleDto,
  ): Promise<ReportScheduleResponseDto> {
    const schedule = await this.database.reportSchedule.findUnique({
      where: { id: scheduleId, tenantId },
    });

    if (!schedule) {
      throw new NotFoundException('Report schedule not found');
    }

    const updateData: any = { ...dto };

    if (dto.frequency || dto.dayOfWeek || dto.dayOfMonth || dto.time) {
      const scheduleDto = {
        ...schedule,
        ...dto,
      } as ReportScheduleDto;
      updateData.nextRunAt = this.reportScheduler.calculateNextRun(scheduleDto);
    }

    const updated = await this.database.reportSchedule.update({
      where: { id: scheduleId },
      data: updateData,
    });

    return this.mapScheduleToResponse(updated);
  }

  async deleteReportSchedule(tenantId: string, scheduleId: string): Promise<void> {
    const schedule = await this.database.reportSchedule.findUnique({
      where: { id: scheduleId, tenantId },
    });

    if (!schedule) {
      throw new NotFoundException('Report schedule not found');
    }

    await this.database.reportSchedule.delete({
      where: { id: scheduleId },
    });
  }

  // Report Management
  async getReports(tenantId: string): Promise<ReportResponseDto[]> {
    const reports = await this.database.report.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return reports.map((r) => this.mapReportToResponse(r));
  }

  async getReport(tenantId: string, reportId: string): Promise<ReportResponseDto> {
    const report = await this.database.report.findUnique({
      where: { id: reportId, tenantId },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    return this.mapReportToResponse(report);
  }

  async deleteReport(tenantId: string, reportId: string): Promise<void> {
    const report = await this.database.report.findUnique({
      where: { id: reportId, tenantId },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    await this.database.report.delete({
      where: { id: reportId },
    });
  }

  // Report Templates
  async createReportTemplate(
    tenantId: string,
    userId: string,
    dto: ReportTemplateDto,
  ): Promise<ReportTemplateResponseDto> {
    const template = await this.database.reportTemplate.create({
      data: {
        tenantId,
        name: dto.name,
        description: dto.description || '',
        type: dto.type,
        configuration: dto.configuration,
        isDefault: false,
        createdBy: userId,
      },
    });

    return this.mapTemplateToResponse(template);
  }

  async getReportTemplates(tenantId: string): Promise<ReportTemplateResponseDto[]> {
    const templates = await this.database.reportTemplate.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });

    return templates.map((t) => this.mapTemplateToResponse(t));
  }

  async getReportTemplate(
    tenantId: string,
    templateId: string,
  ): Promise<ReportTemplateResponseDto> {
    const template = await this.database.reportTemplate.findUnique({
      where: { id: templateId, tenantId },
    });

    if (!template) {
      throw new NotFoundException('Report template not found');
    }

    return this.mapTemplateToResponse(template);
  }

  async deleteReportTemplate(tenantId: string, templateId: string): Promise<void> {
    const template = await this.database.reportTemplate.findUnique({
      where: { id: templateId, tenantId },
    });

    if (!template) {
      throw new NotFoundException('Report template not found');
    }

    await this.database.reportTemplate.delete({
      where: { id: templateId },
    });
  }

  // Helper methods
  private mapReportToResponse(report: any): ReportResponseDto {
    return {
      id: report.id,
      tenantId: report.tenantId,
      type: report.type,
      title: report.title,
      description: report.description,
      format: report.format,
      status: report.status,
      fileUrl: report.fileUrl || '',
      fileSize: report.fileSize || 0,
      generatedBy: report.generatedBy,
      generatedAt: report.generatedAt,
      filters: report.filters || {},
      metadata: report.metadata || {},
    };
  }

  private mapScheduleToResponse(schedule: any): ReportScheduleResponseDto {
    return {
      id: schedule.id,
      tenantId: schedule.tenantId,
      name: schedule.name,
      description: schedule.description,
      reportType: schedule.reportType,
      format: schedule.format,
      frequency: schedule.frequency,
      dayOfWeek: schedule.dayOfWeek,
      dayOfMonth: schedule.dayOfMonth,
      time: schedule.time,
      recipients: schedule.recipients,
      enabled: schedule.enabled,
      lastRunAt: schedule.lastRunAt,
      nextRunAt: schedule.nextRunAt,
      createdAt: schedule.createdAt,
      updatedAt: schedule.updatedAt,
    };
  }

  private mapTemplateToResponse(template: any): ReportTemplateResponseDto {
    return {
      id: template.id,
      tenantId: template.tenantId,
      name: template.name,
      description: template.description,
      type: template.type,
      configuration: template.configuration,
      isDefault: template.isDefault,
      createdBy: template.createdBy,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
    };
  }

  private getDayOfWeekNumber(dayOfWeek: any): number {
    const dayMap: Record<string, number> = {
      MONDAY: 1,
      TUESDAY: 2,
      WEDNESDAY: 3,
      THURSDAY: 4,
      FRIDAY: 5,
      SATURDAY: 6,
      SUNDAY: 7,
    };
    return dayMap[dayOfWeek] || 1;
  }
}
