import { JwtAuthGuard, Roles, RolesGuard } from '@app/auth';
import { CurrentUser, TenantGuard } from '@app/common';
import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateApiKeyDto } from '../dto/api-key.dto';
import { ApiKeyService } from '../services/api-key.service';

@ApiTags('integration/apikeys')
@Controller('apikeys')
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@ApiBearerAuth()
export class ApiKeysController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Post()
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN')
  @ApiOperation({ summary: 'Create a new API key' })
  @ApiResponse({ status: 201, description: 'API key created' })
  async create(
    @Body() dto: CreateApiKeyDto,
    @CurrentUser('id') userId: string,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.apiKeyService.create(userId, tenantId, dto);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN')
  @ApiOperation({ summary: 'List API keys for tenant' })
  @ApiResponse({ status: 200 })
  async list(@CurrentUser('tenantId') tenantId: string) {
    return this.apiKeyService.list(tenantId);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN')
  @ApiOperation({ summary: 'Revoke API key' })
  @ApiResponse({ status: 200 })
  async revoke(@Param('id') id: string) {
    return this.apiKeyService.revoke(id);
  }
}
