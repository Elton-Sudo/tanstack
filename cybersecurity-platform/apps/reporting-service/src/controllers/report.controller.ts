import { JwtAuthGuard } from '@app/auth';
import { TenantGuard } from '@app/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  ReportTemplateDto,
  ReportTemplateResponseDto,
  UpdateReportScheduleDto,
} from '../dto/report.dto';
import { ReportService } from '../services/report.service';

@ApiTags('Reports')
@ApiBearerAuth()
@Controller('reports')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  // Executive Dashboard
  @Get('dashboard/executive')
  @ApiOperation({ summary: 'Get executive dashboard metrics' })
  @ApiResponse({ status: 200, type: DashboardMetricsResponseDto })
  async getExecutiveDashboard(
    @Request() req,
    @Body() dto: DashboardMetricsDto,
  ): Promise<DashboardMetricsResponseDto> {
    return this.reportService.getExecutiveDashboard(req.user.tenantId, dto);
  }

  // Compliance Metrics
  @Get('compliance/:framework')
  @ApiOperation({ summary: 'Get compliance metrics for a framework' })
  @ApiResponse({ status: 200, type: ComplianceMetricsDto })
  async getComplianceMetrics(
    @Request() req,
    @Param('framework') framework: ComplianceFramework,
  ): Promise<ComplianceMetricsDto> {
    return this.reportService.getComplianceMetrics(req.user.tenantId, framework);
  }

  // Report Generation
  @Post('generate')
  @ApiOperation({ summary: 'Generate a new report' })
  @ApiResponse({ status: 201, type: ReportResponseDto })
  async generateReport(@Request() req, @Body() dto: GenerateReportDto): Promise<ReportResponseDto> {
    return this.reportService.generateReport(req.user.tenantId, req.user.sub, dto);
  }

  @Post('generate/compliance')
  @ApiOperation({ summary: 'Generate a compliance report' })
  @ApiResponse({ status: 201, type: ReportResponseDto })
  async generateComplianceReport(
    @Request() req,
    @Body() dto: ComplianceReportDto,
  ): Promise<ReportResponseDto> {
    return this.reportService.generateComplianceReport(req.user.tenantId, req.user.sub, dto);
  }

  @Post('generate/custom')
  @ApiOperation({ summary: 'Generate a custom report' })
  @ApiResponse({ status: 201, type: ReportResponseDto })
  async generateCustomReport(
    @Request() req,
    @Body() dto: CustomReportDto,
  ): Promise<ReportResponseDto> {
    return this.reportService.generateCustomReport(req.user.tenantId, req.user.sub, dto);
  }

  // Report Management
  @Get()
  @ApiOperation({ summary: 'Get all reports' })
  @ApiResponse({ status: 200, type: [ReportResponseDto] })
  async getReports(@Request() req): Promise<ReportResponseDto[]> {
    return this.reportService.getReports(req.user.tenantId);
  }

  @Get(':reportId')
  @ApiOperation({ summary: 'Get a specific report' })
  @ApiResponse({ status: 200, type: ReportResponseDto })
  async getReport(@Request() req, @Param('reportId') reportId: string): Promise<ReportResponseDto> {
    return this.reportService.getReport(req.user.tenantId, reportId);
  }

  @Delete(':reportId')
  @ApiOperation({ summary: 'Delete a report' })
  @ApiResponse({ status: 204 })
  async deleteReport(@Request() req, @Param('reportId') reportId: string): Promise<void> {
    return this.reportService.deleteReport(req.user.tenantId, reportId);
  }

  // Report Schedules
  @Post('schedules')
  @ApiOperation({ summary: 'Create a report schedule' })
  @ApiResponse({ status: 201, type: ReportScheduleResponseDto })
  async createReportSchedule(
    @Request() req,
    @Body() dto: ReportScheduleDto,
  ): Promise<ReportScheduleResponseDto> {
    return this.reportService.createReportSchedule(req.user.tenantId, req.user.sub, dto);
  }

  @Get('schedules')
  @ApiOperation({ summary: 'Get all report schedules' })
  @ApiResponse({ status: 200, type: [ReportScheduleResponseDto] })
  async getReportSchedules(@Request() req): Promise<ReportScheduleResponseDto[]> {
    return this.reportService.getReportSchedules(req.user.tenantId);
  }

  @Get('schedules/:scheduleId')
  @ApiOperation({ summary: 'Get a specific report schedule' })
  @ApiResponse({ status: 200, type: ReportScheduleResponseDto })
  async getReportSchedule(
    @Request() req,
    @Param('scheduleId') scheduleId: string,
  ): Promise<ReportScheduleResponseDto> {
    return this.reportService.getReportSchedule(req.user.tenantId, scheduleId);
  }

  @Put('schedules/:scheduleId')
  @ApiOperation({ summary: 'Update a report schedule' })
  @ApiResponse({ status: 200, type: ReportScheduleResponseDto })
  async updateReportSchedule(
    @Request() req,
    @Param('scheduleId') scheduleId: string,
    @Body() dto: UpdateReportScheduleDto,
  ): Promise<ReportScheduleResponseDto> {
    return this.reportService.updateReportSchedule(req.user.tenantId, scheduleId, dto);
  }

  @Delete('schedules/:scheduleId')
  @ApiOperation({ summary: 'Delete a report schedule' })
  @ApiResponse({ status: 204 })
  async deleteReportSchedule(
    @Request() req,
    @Param('scheduleId') scheduleId: string,
  ): Promise<void> {
    return this.reportService.deleteReportSchedule(req.user.tenantId, scheduleId);
  }

  // Report Templates
  @Post('templates')
  @ApiOperation({ summary: 'Create a report template' })
  @ApiResponse({ status: 201, type: ReportTemplateResponseDto })
  async createReportTemplate(
    @Request() req,
    @Body() dto: ReportTemplateDto,
  ): Promise<ReportTemplateResponseDto> {
    return this.reportService.createReportTemplate(req.user.tenantId, req.user.sub, dto);
  }

  @Get('templates')
  @ApiOperation({ summary: 'Get all report templates' })
  @ApiResponse({ status: 200, type: [ReportTemplateResponseDto] })
  async getReportTemplates(@Request() req): Promise<ReportTemplateResponseDto[]> {
    return this.reportService.getReportTemplates(req.user.tenantId);
  }

  @Get('templates/:templateId')
  @ApiOperation({ summary: 'Get a specific report template' })
  @ApiResponse({ status: 200, type: ReportTemplateResponseDto })
  async getReportTemplate(
    @Request() req,
    @Param('templateId') templateId: string,
  ): Promise<ReportTemplateResponseDto> {
    return this.reportService.getReportTemplate(req.user.tenantId, templateId);
  }

  @Delete('templates/:templateId')
  @ApiOperation({ summary: 'Delete a report template' })
  @ApiResponse({ status: 204 })
  async deleteReportTemplate(
    @Request() req,
    @Param('templateId') templateId: string,
  ): Promise<void> {
    return this.reportService.deleteReportTemplate(req.user.tenantId, templateId);
  }
}
