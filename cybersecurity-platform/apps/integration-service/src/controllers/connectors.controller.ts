import { JwtAuthGuard, Roles, RolesGuard } from '@app/auth';
import { CurrentUser, TenantGuard } from '@app/common';
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateConnectorDto } from '../dto/connector.dto';
import { ConnectorService } from '../services/connector.service';

@ApiTags('integration/connectors')
@Controller('connectors')
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@ApiBearerAuth()
export class ConnectorsController {
  constructor(private readonly connectorService: ConnectorService) {}

  @Post()
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN')
  @ApiOperation({ summary: 'Create connector (e.g., HRIS, SSO)' })
  @ApiResponse({ status: 201 })
  async create(@Body() dto: CreateConnectorDto, @CurrentUser('tenantId') tenantId: string) {
    return this.connectorService.create(tenantId, dto);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN')
  @ApiOperation({ summary: 'List connectors' })
  @ApiResponse({ status: 200 })
  async list(@CurrentUser('tenantId') tenantId: string) {
    return this.connectorService.list(tenantId);
  }

  @Put(':id')
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN')
  @ApiOperation({ summary: 'Update connector' })
  @ApiResponse({ status: 200 })
  async update(@Param('id') id: string, @Body() dto: CreateConnectorDto) {
    return this.connectorService.update(id, dto);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN')
  @ApiOperation({ summary: 'Delete connector' })
  @ApiResponse({ status: 200 })
  async delete(@Param('id') id: string) {
    return this.connectorService.delete(id);
  }
}
