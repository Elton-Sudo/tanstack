import { ComplianceFramework, ReportFormat, ReportStatus, ReportType } from './enums';

export interface DashboardMetrics {
  totalUsers: number;
  activeUsers: number;
  totalCourses: number;
  completedEnrollments: number;
  averageCompletionRate: number;
  averageRiskScore: number;
  highRiskUsers: number;
  phishingSimulationsSent: number;
  phishingClickRate: number;
  complianceRate: number;
  trainingHours: number;
  certificatesIssued: number;
  departmentMetrics: DepartmentMetric[];
  trendData: TrendData;
  topPerformers: Performer[];
  bottomPerformers: Performer[];
}

export interface DepartmentMetric {
  departmentId: string;
  departmentName: string;
  userCount: number;
  completedEnrollments: number;
  totalEnrollments: number;
  completionRate: number;
}

export interface TrendData {
  months: MonthlyData[];
}

export interface MonthlyData {
  month: string;
  enrollments: number;
  completions: number;
  riskScore: number;
}

export interface Performer {
  userId: string;
  name: string;
  email: string;
  completedCourses: number;
  certificates: number;
  score: number;
}

export interface RiskScore {
  id: string;
  userId: string;
  tenantId: string;
  overallScore: number;
  phishingScore: number;
  trainingCompletionScore: number;
  timeSinceTrainingScore: number;
  quizPerformanceScore: number;
  securityIncidentScore: number;
  loginAnomalyScore: number;
  calculatedAt: Date;
}

export interface Report {
  id: string;
  tenantId: string;
  type: ReportType;
  title: string;
  description: string;
  format: ReportFormat;
  status: ReportStatus;
  fileUrl?: string;
  fileSize?: number;
  generatedBy: string;
  generatedAt?: Date;
  filters: Record<string, any>;
  metadata: Record<string, any>;
}

export interface GenerateReportRequest {
  type: ReportType;
  title: string;
  description?: string;
  format: ReportFormat;
  filters?: {
    departmentIds?: string[];
    userIds?: string[];
    courseIds?: string[];
    dateRange?: {
      startDate: Date;
      endDate: Date;
    };
  };
  includeCharts?: boolean;
  includeRawData?: boolean;
}

export interface ComplianceMetrics {
  framework: ComplianceFramework;
  overallCompliance: number;
  compliantUsers: number;
  nonCompliantUsers: number;
  requiredTrainings: number;
  completedTrainings: number;
  pendingTrainings: number;
  overdueTrainings: number;
  controlsAssessed: number;
  controlsPassed: number;
  controlsFailed: number;
  lastAuditDate: Date;
  nextAuditDate: Date;
  findings: any[];
  recommendations: string[];
  evidence: any[];
}
