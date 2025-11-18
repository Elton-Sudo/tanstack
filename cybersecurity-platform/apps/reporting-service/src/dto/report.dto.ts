import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

// Enums
export enum ReportType {
  EXECUTIVE_DASHBOARD = 'EXECUTIVE_DASHBOARD',
  COMPLIANCE_REPORT = 'COMPLIANCE_REPORT',
  USER_PROGRESS = 'USER_PROGRESS',
  PHISHING_SIMULATION = 'PHISHING_SIMULATION',
  RISK_ASSESSMENT = 'RISK_ASSESSMENT',
  TRAINING_EFFECTIVENESS = 'TRAINING_EFFECTIVENESS',
  DEPARTMENT_PERFORMANCE = 'DEPARTMENT_PERFORMANCE',
  CUSTOM = 'CUSTOM',
}

export enum ComplianceFramework {
  POPIA = 'POPIA',
  GDPR = 'GDPR',
  SOC2 = 'SOC2',
  ISO27001 = 'ISO27001',
  NIST = 'NIST',
  HIPAA = 'HIPAA',
  PCI_DSS = 'PCI_DSS',
}

export enum ReportFormat {
  PDF = 'PDF',
  EXCEL = 'EXCEL',
  CSV = 'CSV',
  JSON = 'JSON',
  HTML = 'HTML',
}

export enum ScheduleFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
}

export enum ReportStatus {
  PENDING = 'PENDING',
  GENERATING = 'GENERATING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  SCHEDULED = 'SCHEDULED',
}

export enum DayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

// DTOs
export class DateRangeDto {
  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  endDate: Date;
}

export class ReportFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  departmentIds?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  userIds?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  courseIds?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => DateRangeDto)
  dateRange?: DateRangeDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  minCompletionRate?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  minRiskScore?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  customFilters?: Record<string, any>;
}

export class GenerateReportDto {
  @ApiProperty({ enum: ReportType })
  @IsEnum(ReportType)
  @IsNotEmpty()
  type: ReportType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ReportFormat })
  @IsEnum(ReportFormat)
  @IsNotEmpty()
  format: ReportFormat;

  @ApiPropertyOptional({ type: ReportFilterDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ReportFilterDto)
  filters?: ReportFilterDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  includeCharts?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  includeRawData?: boolean;
}

export class ComplianceReportDto {
  @ApiProperty({ enum: ComplianceFramework })
  @IsEnum(ComplianceFramework)
  @IsNotEmpty()
  framework: ComplianceFramework;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ReportFormat })
  @IsEnum(ReportFormat)
  @IsNotEmpty()
  format: ReportFormat;

  @ApiProperty({ type: DateRangeDto })
  @ValidateNested()
  @Type(() => DateRangeDto)
  @IsNotEmpty()
  dateRange: DateRangeDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  includeEvidence?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  includeRecommendations?: boolean;
}

export class CustomReportColumnDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  field: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  aggregation?: string; // sum, avg, count, min, max

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  sortable?: boolean;
}

export class CustomReportDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ type: [CustomReportColumnDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CustomReportColumnDto)
  columns: CustomReportColumnDto[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  dataSource: string; // users, courses, enrollments, analytics, etc.

  @ApiProperty({ enum: ReportFormat })
  @IsEnum(ReportFormat)
  @IsNotEmpty()
  format: ReportFormat;

  @ApiPropertyOptional({ type: ReportFilterDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ReportFilterDto)
  filters?: ReportFilterDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  groupBy?: Record<string, any>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  orderBy?: Record<string, 'asc' | 'desc'>;
}

export class ReportScheduleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ReportType })
  @IsEnum(ReportType)
  @IsNotEmpty()
  reportType: ReportType;

  @ApiProperty({ enum: ReportFormat })
  @IsEnum(ReportFormat)
  @IsNotEmpty()
  format: ReportFormat;

  @ApiProperty({ enum: ScheduleFrequency })
  @IsEnum(ScheduleFrequency)
  @IsNotEmpty()
  frequency: ScheduleFrequency;

  @ApiPropertyOptional({ enum: DayOfWeek })
  @IsOptional()
  @IsEnum(DayOfWeek)
  dayOfWeek?: DayOfWeek;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(31)
  dayOfMonth?: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  time: string; // HH:mm format

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsEmail({}, { each: true })
  recipients: string[];

  @ApiPropertyOptional({ type: ReportFilterDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ReportFilterDto)
  filters?: ReportFilterDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}

export class UpdateReportScheduleDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: ScheduleFrequency })
  @IsOptional()
  @IsEnum(ScheduleFrequency)
  frequency?: ScheduleFrequency;

  @ApiPropertyOptional({ enum: DayOfWeek })
  @IsOptional()
  @IsEnum(DayOfWeek)
  dayOfWeek?: DayOfWeek;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(31)
  dayOfMonth?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  time?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  recipients?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}

export class DashboardMetricsDto {
  @ApiPropertyOptional({ type: DateRangeDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => DateRangeDto)
  dateRange?: DateRangeDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  departmentIds?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  includeSubDepartments?: boolean;
}

export class ExportReportDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  reportId: string;

  @ApiProperty({ enum: ReportFormat })
  @IsEnum(ReportFormat)
  @IsNotEmpty()
  format: ReportFormat;
}

// Response DTOs
export class ReportResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  tenantId: string;

  @ApiProperty({ enum: ReportType })
  type: ReportType;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: ReportFormat })
  format: ReportFormat;

  @ApiProperty({ enum: ReportStatus })
  status: ReportStatus;

  @ApiProperty()
  fileUrl: string;

  @ApiProperty()
  fileSize: number;

  @ApiProperty()
  generatedBy: string;

  @ApiProperty()
  generatedAt: Date;

  @ApiProperty()
  filters: Record<string, any>;

  @ApiProperty()
  metadata: Record<string, any>;
}

export class ReportScheduleResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  tenantId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: ReportType })
  reportType: ReportType;

  @ApiProperty({ enum: ReportFormat })
  format: ReportFormat;

  @ApiProperty({ enum: ScheduleFrequency })
  frequency: ScheduleFrequency;

  @ApiProperty()
  dayOfWeek: string;

  @ApiProperty()
  dayOfMonth: number;

  @ApiProperty()
  time: string;

  @ApiProperty()
  recipients: string[];

  @ApiProperty()
  enabled: boolean;

  @ApiProperty()
  lastRunAt: Date;

  @ApiProperty()
  nextRunAt: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class DashboardMetricsResponseDto {
  @ApiProperty()
  totalUsers: number;

  @ApiProperty()
  activeUsers: number;

  @ApiProperty()
  totalCourses: number;

  @ApiProperty()
  completedEnrollments: number;

  @ApiProperty()
  averageCompletionRate: number;

  @ApiProperty()
  averageRiskScore: number;

  @ApiProperty()
  highRiskUsers: number;

  @ApiProperty()
  phishingSimulationsSent: number;

  @ApiProperty()
  phishingClickRate: number;

  @ApiProperty()
  complianceRate: number;

  @ApiProperty()
  trainingHours: number;

  @ApiProperty()
  certificatesIssued: number;

  @ApiProperty()
  departmentMetrics: Record<string, any>[];

  @ApiProperty()
  trendData: Record<string, any>;

  @ApiProperty()
  topPerformers: Record<string, any>[];

  @ApiProperty()
  bottomPerformers: Record<string, any>[];
}

export class ComplianceMetricsDto {
  @ApiProperty()
  framework: ComplianceFramework;

  @ApiProperty()
  overallCompliance: number;

  @ApiProperty()
  compliantUsers: number;

  @ApiProperty()
  nonCompliantUsers: number;

  @ApiProperty()
  requiredTrainings: number;

  @ApiProperty()
  completedTrainings: number;

  @ApiProperty()
  pendingTrainings: number;

  @ApiProperty()
  overdueTrainings: number;

  @ApiProperty()
  controlsAssessed: number;

  @ApiProperty()
  controlsPassed: number;

  @ApiProperty()
  controlsFailed: number;

  @ApiProperty()
  lastAuditDate: Date;

  @ApiProperty()
  nextAuditDate: Date;

  @ApiProperty()
  findings: Record<string, any>[];

  @ApiProperty()
  recommendations: string[];

  @ApiProperty()
  evidence: Record<string, any>[];
}

export class ReportTemplateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ReportType })
  @IsEnum(ReportType)
  @IsNotEmpty()
  type: ReportType;

  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  configuration: Record<string, any>;
}

export class ReportTemplateResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  tenantId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: ReportType })
  type: ReportType;

  @ApiProperty()
  configuration: Record<string, any>;

  @ApiProperty()
  isDefault: boolean;

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
