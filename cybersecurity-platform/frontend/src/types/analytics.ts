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

export interface PhishingCampaign {
  id: string;
  tenantId: string;
  name: string;
  subject: string;
  emailTemplate: string;
  targetDepartmentIds: string[];
  targetUserIds?: string[];
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
  redFlags: string[];
  scheduledFor?: Date;
  sentAt?: Date;
  completedAt?: Date;
  status: 'DRAFT' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED';
  createdBy: string;
  createdAt: Date;
  metadata?: Record<string, any>;
}

export interface PhishingEvent {
  id: string;
  tenantId: string;
  userId: string;
  campaignId: string;
  subject: string;
  sentAt: Date;
  opened: boolean;
  openedAt?: Date;
  clicked: boolean;
  clickedAt?: Date;
  reported: boolean;
  reportedAt?: Date;
  deleted: boolean;
  deletedAt?: Date;
  metadata?: Record<string, any>;
}

export interface PhishingCampaignStats {
  campaignId: string;
  totalSent: number;
  totalOpened: number;
  totalClicked: number;
  totalReported: number;
  totalDeleted: number;
  openRate: number;
  clickRate: number;
  reportRate: number;
  deleteRate: number;
  averageTimeToClick?: number;
  averageTimeToReport?: number;
}

export interface PhishingUserHistory {
  userId: string;
  totalSimulations: number;
  clicked: number;
  reported: number;
  clickRate: number;
  reportRate: number;
  lastSimulation?: Date;
  trend: 'IMPROVING' | 'DECLINING' | 'STABLE';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface PhishingTenantStats {
  tenantId: string;
  totalCampaigns: number;
  totalSimulationsSent: number;
  overallClickRate: number;
  overallReportRate: number;
  vulnerableUsers: number;
  trainedUsers: number;
  improvement: number;
  departmentStats: PhishingDepartmentStat[];
}

export interface PhishingDepartmentStat {
  departmentId: string;
  departmentName: string;
  totalSent: number;
  clickRate: number;
  reportRate: number;
  vulnerableUserCount: number;
}

export interface VulnerableUser {
  userId: string;
  name: string;
  email: string;
  department: string;
  clickRate: number;
  reportRate: number;
  lastClicked?: Date;
  simulationsReceived: number;
  riskLevel: 'HIGH' | 'CRITICAL';
}

export interface RiskScoreWithUser extends RiskScore {
  user: {
    id: string;
    name: string;
    email: string;
    department?: string;
  };
  recommendations: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface TenantRiskStats {
  tenantId: string;
  averageRiskScore: number;
  lowRiskUsers: number;
  mediumRiskUsers: number;
  highRiskUsers: number;
  criticalRiskUsers: number;
  departmentRiskScores: DepartmentRiskScore[];
  trendData: RiskTrendData[];
}

export interface DepartmentRiskScore {
  departmentId: string;
  departmentName: string;
  averageRiskScore: number;
  userCount: number;
  highRiskCount: number;
  criticalRiskCount: number;
}

export interface RiskTrendData {
  date: string;
  averageScore: number;
  highRiskCount: number;
  criticalRiskCount: number;
}
