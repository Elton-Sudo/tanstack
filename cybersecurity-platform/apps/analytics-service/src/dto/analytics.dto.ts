import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum BehaviorEventType {
  LOGIN = 'LOGIN',
  COURSE_START = 'COURSE_START',
  COURSE_COMPLETE = 'COURSE_COMPLETE',
  QUIZ_ATTEMPT = 'QUIZ_ATTEMPT',
  PHISHING_CLICK = 'PHISHING_CLICK',
  PHISHING_REPORT = 'PHISHING_REPORT',
  POLICY_VIOLATION = 'POLICY_VIOLATION',
  SECURITY_INCIDENT = 'SECURITY_INCIDENT',
}

export enum TimeRange {
  LAST_7_DAYS = 'LAST_7_DAYS',
  LAST_30_DAYS = 'LAST_30_DAYS',
  LAST_90_DAYS = 'LAST_90_DAYS',
  LAST_YEAR = 'LAST_YEAR',
  CUSTOM = 'CUSTOM',
}

// ======================== RISK SCORING DTOS ========================

export class CalculateRiskScoreDto {
  @ApiProperty({ description: 'User ID to calculate risk for' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Tenant ID' })
  @IsUUID()
  @IsNotEmpty()
  tenantId: string;

  @ApiPropertyOptional({
    description: 'Force recalculation even if recent score exists',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  forceRecalculate?: boolean;
}

export class GetRiskScoreDto {
  @ApiProperty({ description: 'User ID' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}

export class ListRiskScoresDto {
  @ApiPropertyOptional({ description: 'Filter by tenant ID' })
  @IsUUID()
  @IsOptional()
  tenantId?: string;

  @ApiPropertyOptional({ enum: RiskLevel, description: 'Filter by risk level' })
  @IsEnum(RiskLevel)
  @IsOptional()
  riskLevel?: RiskLevel;

  @ApiPropertyOptional({ description: 'Minimum risk score (0-100)', minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  minScore?: number;

  @ApiPropertyOptional({ description: 'Maximum risk score (0-100)', minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  maxScore?: number;

  @ApiPropertyOptional({ description: 'Page number', default: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page',
    default: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 20;
}

export class GetTenantRiskOverviewDto {
  @ApiProperty({ description: 'Tenant ID' })
  @IsUUID()
  @IsNotEmpty()
  tenantId: string;
}

// ======================== PHISHING SIMULATION DTOS ========================

export class RecordPhishingEventDto {
  @ApiProperty({ description: 'User ID' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Tenant ID' })
  @IsUUID()
  @IsNotEmpty()
  tenantId: string;

  @ApiProperty({ description: 'Campaign ID' })
  @IsString()
  @IsNotEmpty()
  campaignId: string;

  @ApiProperty({ description: 'Was the phishing link clicked' })
  @IsBoolean()
  @IsNotEmpty()
  wasClicked: boolean;

  @ApiProperty({ description: 'Was the email reported as phishing' })
  @IsBoolean()
  @IsNotEmpty()
  wasReported: boolean;
}

export class GetPhishingStatsDto {
  @ApiPropertyOptional({ description: 'Tenant ID' })
  @IsUUID()
  @IsOptional()
  tenantId?: string;

  @ApiPropertyOptional({ description: 'User ID' })
  @IsUUID()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({
    enum: TimeRange,
    description: 'Time range',
    default: TimeRange.LAST_30_DAYS,
  })
  @IsEnum(TimeRange)
  @IsOptional()
  timeRange?: TimeRange = TimeRange.LAST_30_DAYS;
}

// ======================== BEHAVIORAL ANALYTICS DTOS ========================

export class RecordBehaviorEventDto {
  @ApiProperty({ description: 'User ID' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Tenant ID' })
  @IsUUID()
  @IsNotEmpty()
  tenantId: string;

  @ApiProperty({ enum: BehaviorEventType, description: 'Event type' })
  @IsEnum(BehaviorEventType)
  @IsNotEmpty()
  patternType: BehaviorEventType;

  @ApiPropertyOptional({ description: 'Additional event metadata' })
  @IsOptional()
  metadata?: Record<string, any>;
}

export class GetBehaviorPatternsDto {
  @ApiPropertyOptional({ description: 'User ID' })
  @IsUUID()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({ description: 'Tenant ID' })
  @IsUUID()
  @IsOptional()
  tenantId?: string;

  @ApiPropertyOptional({ enum: BehaviorEventType, description: 'Filter by event type' })
  @IsEnum(BehaviorEventType)
  @IsOptional()
  patternType?: BehaviorEventType;

  @ApiPropertyOptional({ description: 'Start date (ISO 8601)' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date (ISO 8601)' })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Page number', default: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page',
    default: 50,
    minimum: 1,
    maximum: 100,
  })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 50;
}

export class AnalyzeBehaviorDto {
  @ApiProperty({ description: 'User ID to analyze' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Tenant ID' })
  @IsUUID()
  @IsNotEmpty()
  tenantId: string;

  @ApiPropertyOptional({
    enum: TimeRange,
    description: 'Analysis time range',
    default: TimeRange.LAST_30_DAYS,
  })
  @IsEnum(TimeRange)
  @IsOptional()
  timeRange?: TimeRange = TimeRange.LAST_30_DAYS;
}

// ======================== AI RECOMMENDATIONS DTOS ========================

export class GetRecommendationsDto {
  @ApiProperty({ description: 'User ID' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Tenant ID' })
  @IsUUID()
  @IsNotEmpty()
  tenantId: string;

  @ApiPropertyOptional({
    description: 'Maximum number of recommendations',
    default: 5,
    minimum: 1,
    maximum: 20,
  })
  @IsInt()
  @Min(1)
  @Max(20)
  @IsOptional()
  limit?: number = 5;
}

export class GetTenantRecommendationsDto {
  @ApiProperty({ description: 'Tenant ID' })
  @IsUUID()
  @IsNotEmpty()
  tenantId: string;

  @ApiPropertyOptional({
    description: 'Maximum number of recommendations',
    default: 10,
    minimum: 1,
    maximum: 50,
  })
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  limit?: number = 10;
}

// ======================== PREDICTIVE ANALYTICS DTOS ========================

export class PredictRiskTrendDto {
  @ApiProperty({ description: 'User ID' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Tenant ID' })
  @IsUUID()
  @IsNotEmpty()
  tenantId: string;

  @ApiPropertyOptional({
    description: 'Prediction days ahead',
    default: 30,
    minimum: 7,
    maximum: 90,
  })
  @IsInt()
  @Min(7)
  @Max(90)
  @IsOptional()
  daysAhead?: number = 30;
}

export class PredictComplianceDto {
  @ApiProperty({ description: 'Tenant ID' })
  @IsUUID()
  @IsNotEmpty()
  tenantId: string;

  @ApiPropertyOptional({
    description: 'Prediction days ahead',
    default: 30,
    minimum: 7,
    maximum: 90,
  })
  @IsInt()
  @Min(7)
  @Max(90)
  @IsOptional()
  daysAhead?: number = 30;
}

// ======================== AUTO-REMEDIATION DTOS ========================

export class TriggerAutoRemediationDto {
  @ApiProperty({ description: 'User ID' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Tenant ID' })
  @IsUUID()
  @IsNotEmpty()
  tenantId: string;

  @ApiProperty({ description: 'Reason for remediation' })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsOptional()
  metadata?: Record<string, any>;
}

export class GetRemediationActionsDto {
  @ApiPropertyOptional({ description: 'User ID' })
  @IsUUID()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({ description: 'Tenant ID' })
  @IsUUID()
  @IsOptional()
  tenantId?: string;

  @ApiPropertyOptional({
    enum: TimeRange,
    description: 'Time range',
    default: TimeRange.LAST_30_DAYS,
  })
  @IsEnum(TimeRange)
  @IsOptional()
  timeRange?: TimeRange = TimeRange.LAST_30_DAYS;
}

// ======================== DASHBOARD DTOS ========================

export class GetDashboardStatsDto {
  @ApiProperty({ description: 'Tenant ID' })
  @IsUUID()
  @IsNotEmpty()
  tenantId: string;

  @ApiPropertyOptional({
    enum: TimeRange,
    description: 'Time range',
    default: TimeRange.LAST_30_DAYS,
  })
  @IsEnum(TimeRange)
  @IsOptional()
  timeRange?: TimeRange = TimeRange.LAST_30_DAYS;
}

export class GetEngagementMetricsDto {
  @ApiPropertyOptional({ description: 'Tenant ID' })
  @IsUUID()
  @IsOptional()
  tenantId?: string;

  @ApiPropertyOptional({
    enum: TimeRange,
    description: 'Time range',
    default: TimeRange.LAST_30_DAYS,
  })
  @IsEnum(TimeRange)
  @IsOptional()
  timeRange?: TimeRange = TimeRange.LAST_30_DAYS;
}

export class GetCompletionRatesDto {
  @ApiProperty({ description: 'Tenant ID' })
  @IsUUID()
  @IsNotEmpty()
  tenantId: string;

  @ApiPropertyOptional({ description: 'Course ID to filter by' })
  @IsUUID()
  @IsOptional()
  courseId?: string;

  @ApiPropertyOptional({
    enum: TimeRange,
    description: 'Time range',
    default: TimeRange.LAST_30_DAYS,
  })
  @IsEnum(TimeRange)
  @IsOptional()
  timeRange?: TimeRange = TimeRange.LAST_30_DAYS;
}

// ======================== TREND ANALYSIS DTOS ========================

export class GetRiskTrendsDto {
  @ApiPropertyOptional({ description: 'Tenant ID' })
  @IsUUID()
  @IsOptional()
  tenantId?: string;

  @ApiPropertyOptional({ description: 'User ID' })
  @IsUUID()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({
    enum: TimeRange,
    description: 'Time range',
    default: TimeRange.LAST_90_DAYS,
  })
  @IsEnum(TimeRange)
  @IsOptional()
  timeRange?: TimeRange = TimeRange.LAST_90_DAYS;

  @ApiPropertyOptional({
    description: 'Data granularity (daily/weekly/monthly)',
    default: 'weekly',
  })
  @IsString()
  @IsOptional()
  granularity?: string = 'weekly';
}

export class GetTrainingTrendsDto {
  @ApiProperty({ description: 'Tenant ID' })
  @IsUUID()
  @IsNotEmpty()
  tenantId: string;

  @ApiPropertyOptional({
    enum: TimeRange,
    description: 'Time range',
    default: TimeRange.LAST_90_DAYS,
  })
  @IsEnum(TimeRange)
  @IsOptional()
  timeRange?: TimeRange = TimeRange.LAST_90_DAYS;
}

// ======================== RESPONSE DTOS ========================

export class RiskScoreResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  tenantId: string;

  @ApiProperty({ description: 'Overall risk score (0-100)' })
  overallScore: number;

  @ApiProperty({ enum: RiskLevel })
  riskLevel: RiskLevel;

  @ApiProperty()
  phishingScore: number;

  @ApiProperty()
  trainingCompletionScore: number;

  @ApiProperty()
  timeSinceTrainingScore: number;

  @ApiProperty()
  quizPerformanceScore: number;

  @ApiProperty()
  securityIncidentScore: number;

  @ApiProperty()
  loginAnomalyScore: number;

  @ApiProperty()
  calculatedAt: Date;
}

export class BehaviorPatternResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  tenantId: string;

  @ApiProperty({ enum: BehaviorEventType })
  patternType: BehaviorEventType;

  @ApiProperty()
  metadata: any;

  @ApiProperty()
  detectedAt: Date;
}

export class RecommendationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ description: 'Recommended course or action' })
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ description: 'Recommendation reason' })
  reason: string;

  @ApiProperty({ description: 'Priority score (0-100)' })
  priority: number;

  @ApiProperty({ enum: ['COURSE', 'ACTION', 'POLICY', 'TRAINING'] })
  type: string;

  @ApiProperty({ required: false })
  resourceId?: string;
}
