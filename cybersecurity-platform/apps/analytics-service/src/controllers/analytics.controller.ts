import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  AnalyzeBehaviorDto,
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
  GetTrainingTrendsDto,
  ListRiskScoresDto,
  PredictComplianceDto,
  PredictRiskTrendDto,
  RecommendationResponseDto,
  RecordBehaviorEventDto,
  RecordPhishingEventDto,
  RiskScoreResponseDto,
  TriggerAutoRemediationDto,
} from '../dto/analytics.dto';
import { AnalyticsService } from '../services/analytics.service';

@ApiTags('analytics')
@Controller('analytics')
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // ======================== RISK SCORING ========================

  @Post('risk/calculate')
  @ApiOperation({ summary: 'Calculate user risk score' })
  @ApiResponse({ status: 201, type: RiskScoreResponseDto })
  async calculateRiskScore(@Body() dto: CalculateRiskScoreDto): Promise<RiskScoreResponseDto> {
    return this.analyticsService.calculateRiskScore(dto);
  }

  @Get('risk/:userId')
  @ApiOperation({ summary: 'Get latest risk score for user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, type: RiskScoreResponseDto })
  async getRiskScore(@Param('userId') userId: string): Promise<RiskScoreResponseDto> {
    return this.analyticsService.getRiskScore(userId);
  }

  @Get('risk')
  @ApiOperation({ summary: 'List risk scores with filters' })
  @ApiQuery({ name: 'tenantId', required: false })
  @ApiQuery({ name: 'riskLevel', required: false, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] })
  @ApiQuery({ name: 'minScore', required: false, type: Number })
  @ApiQuery({ name: 'maxScore', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200 })
  async listRiskScores(@Query() dto: ListRiskScoresDto) {
    return this.analyticsService.listRiskScores(dto);
  }

  @Get('risk/tenant/:tenantId/overview')
  @ApiOperation({ summary: 'Get tenant risk overview' })
  @ApiParam({ name: 'tenantId', description: 'Tenant ID' })
  @ApiResponse({ status: 200 })
  async getTenantRiskOverview(@Param('tenantId') tenantId: string) {
    return this.analyticsService.getTenantRiskOverview({ tenantId });
  }

  // ======================== PHISHING SIMULATION ========================

  @Post('phishing/record')
  @ApiOperation({ summary: 'Record phishing simulation event' })
  @ApiResponse({ status: 201 })
  async recordPhishingEvent(@Body() dto: RecordPhishingEventDto) {
    return this.analyticsService.recordPhishingEvent(dto);
  }

  @Get('phishing/stats')
  @ApiOperation({ summary: 'Get phishing simulation statistics' })
  @ApiQuery({ name: 'tenantId', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({
    name: 'timeRange',
    required: false,
    enum: ['LAST_7_DAYS', 'LAST_30_DAYS', 'LAST_90_DAYS', 'LAST_YEAR'],
  })
  @ApiResponse({ status: 200 })
  async getPhishingStats(@Query() dto: GetPhishingStatsDto) {
    return this.analyticsService.getPhishingStats(dto);
  }

  // ======================== BEHAVIORAL ANALYTICS ========================

  @Post('behavior/record')
  @ApiOperation({ summary: 'Record user behavior event' })
  @ApiResponse({ status: 201, type: BehaviorPatternResponseDto })
  async recordBehaviorEvent(
    @Body() dto: RecordBehaviorEventDto,
  ): Promise<BehaviorPatternResponseDto> {
    return this.analyticsService.recordBehaviorEvent(dto);
  }

  @Get('behavior/patterns')
  @ApiOperation({ summary: 'Get behavior patterns with filters' })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'tenantId', required: false })
  @ApiQuery({
    name: 'patternType',
    required: false,
    enum: [
      'LOGIN',
      'COURSE_START',
      'COURSE_COMPLETE',
      'QUIZ_ATTEMPT',
      'PHISHING_CLICK',
      'PHISHING_REPORT',
      'POLICY_VIOLATION',
      'SECURITY_INCIDENT',
    ],
  })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200 })
  async getBehaviorPatterns(@Query() dto: GetBehaviorPatternsDto) {
    return this.analyticsService.getBehaviorPatterns(dto);
  }

  @Post('behavior/analyze')
  @ApiOperation({ summary: 'Analyze user behavior patterns' })
  @ApiResponse({ status: 200 })
  async analyzeBehavior(@Body() dto: AnalyzeBehaviorDto) {
    return this.analyticsService.analyzeBehavior(dto);
  }

  // ======================== AI RECOMMENDATIONS ========================

  @Post('recommendations/user')
  @ApiOperation({ summary: 'Get AI-powered recommendations for user' })
  @ApiResponse({ status: 200, type: [RecommendationResponseDto] })
  async getRecommendations(
    @Body() dto: GetRecommendationsDto,
  ): Promise<RecommendationResponseDto[]> {
    return this.analyticsService.getRecommendations(dto);
  }

  @Post('recommendations/tenant')
  @ApiOperation({ summary: 'Get AI-powered recommendations for tenant' })
  @ApiResponse({ status: 200, type: [RecommendationResponseDto] })
  async getTenantRecommendations(@Body() dto: GetTenantRecommendationsDto) {
    return this.analyticsService.getTenantRecommendations(dto);
  }

  // ======================== PREDICTIVE ANALYTICS ========================

  @Post('predict/risk-trend')
  @ApiOperation({ summary: 'Predict user risk score trend' })
  @ApiResponse({ status: 200 })
  async predictRiskTrend(@Body() dto: PredictRiskTrendDto) {
    return this.analyticsService.predictRiskTrend(dto);
  }

  @Post('predict/compliance')
  @ApiOperation({ summary: 'Predict tenant compliance rate' })
  @ApiResponse({ status: 200 })
  async predictCompliance(@Body() dto: PredictComplianceDto) {
    return this.analyticsService.predictCompliance(dto);
  }

  // ======================== AUTO-REMEDIATION ========================

  @Post('remediation/trigger')
  @ApiOperation({ summary: 'Trigger auto-remediation for user' })
  @ApiResponse({ status: 201 })
  async triggerAutoRemediation(@Body() dto: TriggerAutoRemediationDto) {
    return this.analyticsService.triggerAutoRemediation(dto);
  }

  @Get('remediation/actions')
  @ApiOperation({ summary: 'Get remediation actions history' })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'tenantId', required: false })
  @ApiQuery({
    name: 'timeRange',
    required: false,
    enum: ['LAST_7_DAYS', 'LAST_30_DAYS', 'LAST_90_DAYS', 'LAST_YEAR'],
  })
  @ApiResponse({ status: 200 })
  async getRemediationActions(@Query() dto: GetRemediationActionsDto) {
    return this.analyticsService.getRemediationActions(dto);
  }

  // ======================== DASHBOARD & METRICS ========================

  @Post('dashboard/stats')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({ status: 200 })
  async getDashboardStats(@Body() dto: GetDashboardStatsDto) {
    return this.analyticsService.getDashboardStats(dto);
  }

  @Get('metrics/engagement')
  @ApiOperation({ summary: 'Get user engagement metrics' })
  @ApiQuery({ name: 'tenantId', required: false })
  @ApiQuery({
    name: 'timeRange',
    required: false,
    enum: ['LAST_7_DAYS', 'LAST_30_DAYS', 'LAST_90_DAYS', 'LAST_YEAR'],
  })
  @ApiResponse({ status: 200 })
  async getEngagementMetrics(@Query() dto: GetEngagementMetricsDto) {
    return this.analyticsService.getEngagementMetrics(dto);
  }

  @Post('metrics/completion-rates')
  @ApiOperation({ summary: 'Get course completion rates' })
  @ApiResponse({ status: 200 })
  async getCompletionRates(@Body() dto: GetCompletionRatesDto) {
    return this.analyticsService.getCompletionRates(dto);
  }

  // ======================== TREND ANALYSIS ========================

  @Get('trends/risk')
  @ApiOperation({ summary: 'Get risk score trends over time' })
  @ApiQuery({ name: 'tenantId', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({
    name: 'timeRange',
    required: false,
    enum: ['LAST_7_DAYS', 'LAST_30_DAYS', 'LAST_90_DAYS', 'LAST_YEAR'],
  })
  @ApiQuery({ name: 'granularity', required: false, enum: ['daily', 'weekly', 'monthly'] })
  @ApiResponse({ status: 200 })
  async getRiskTrends(@Query() dto: GetRiskTrendsDto) {
    return this.analyticsService.getRiskTrends(dto);
  }

  @Post('trends/training')
  @ApiOperation({ summary: 'Get training completion trends' })
  @ApiResponse({ status: 200 })
  async getTrainingTrends(@Body() dto: GetTrainingTrendsDto) {
    return this.analyticsService.getTrainingTrends(dto);
  }
}
