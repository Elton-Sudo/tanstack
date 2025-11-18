import { CurrentUser, PaginationDto, Roles } from '@app/common';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReportSecurityEventDto } from '../dto/audit.dto';
import { AuditService } from '../services/audit.service';

@ApiTags('audit')
@ApiBearerAuth()
@Controller('auth/audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get('login-history')
  @ApiOperation({ summary: 'Get login history' })
  async getLoginHistory(@CurrentUser('id') userId: string, @Query() pagination: PaginationDto) {
    return this.auditService.getLoginHistory(userId, pagination);
  }

  @Get('security-events')
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN')
  @ApiOperation({ summary: 'Get security events log' })
  async getSecurityEvents(@Query() pagination: PaginationDto) {
    return this.auditService.getSecurityEvents(pagination);
  }

  @Post('security/report')
  @ApiOperation({ summary: 'Report suspicious activity' })
  async reportSuspiciousActivity(
    @CurrentUser('id') userId: string,
    @Body() reportDto: ReportSecurityEventDto,
  ) {
    return this.auditService.reportSecurityEvent(userId, reportDto);
  }

  @Get('security/devices')
  @ApiOperation({ summary: 'List authorized devices' })
  async getAuthorizedDevices(@CurrentUser('id') userId: string) {
    return this.auditService.getAuthorizedDevices(userId);
  }
}
