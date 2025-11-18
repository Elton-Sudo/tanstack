import { CurrentUser, Roles } from '@app/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateTenantDto,
  TenantStatus,
  UpdateSubscriptionDto,
  UpdateTenantDto,
  UpdateTenantSettingsDto,
} from '../dto/tenant.dto';
import { TenantService } from '../services/tenant.service';

@ApiTags('tenants')
@ApiBearerAuth()
@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post()
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Create a new tenant' })
  @ApiResponse({ status: 201, description: 'Tenant created successfully' })
  async create(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantService.create(createTenantDto);
  }

  @Get()
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'List all tenants with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: TenantStatus })
  @ApiResponse({ status: 200, description: 'Returns paginated list of tenants' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: TenantStatus,
  ) {
    return this.tenantService.findAll(page, limit, status);
  }

  @Get(':id')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Get tenant by ID' })
  @ApiResponse({ status: 200, description: 'Returns tenant details' })
  async findOne(@Param('id') id: string, @CurrentUser('tenantId') userTenantId: string) {
    // Non-super admins can only view their own tenant
    if (userTenantId && userTenantId !== id) {
      return this.tenantService.findOne(userTenantId);
    }
    return this.tenantService.findOne(id);
  }

  @Get('slug/:slug')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Get tenant by slug' })
  @ApiResponse({ status: 200, description: 'Returns tenant details' })
  async findBySlug(@Param('slug') slug: string) {
    return this.tenantService.findBySlug(slug);
  }

  @Put(':id')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Update tenant' })
  @ApiResponse({ status: 200, description: 'Tenant updated successfully' })
  async update(
    @Param('id') id: string,
    @Body() updateTenantDto: UpdateTenantDto,
    @CurrentUser('tenantId') userTenantId: string,
    @CurrentUser('role') userRole: string,
  ) {
    // Non-super admins can only update their own tenant
    const tenantId = userRole === 'SUPER_ADMIN' ? id : userTenantId;
    return this.tenantService.update(tenantId, updateTenantDto);
  }

  @Patch(':id/settings')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Update tenant settings' })
  @ApiResponse({ status: 200, description: 'Settings updated successfully' })
  async updateSettings(
    @Param('id') id: string,
    @Body() updateSettingsDto: UpdateTenantSettingsDto,
    @CurrentUser('tenantId') userTenantId: string,
    @CurrentUser('role') userRole: string,
  ) {
    const tenantId = userRole === 'SUPER_ADMIN' ? id : userTenantId;
    return this.tenantService.updateSettings(tenantId, updateSettingsDto);
  }

  @Patch(':id/subscription')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Update tenant subscription plan' })
  @ApiResponse({ status: 200, description: 'Subscription updated successfully' })
  async updateSubscription(
    @Param('id') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
    @CurrentUser('tenantId') userTenantId: string,
    @CurrentUser('role') userRole: string,
  ) {
    const tenantId = userRole === 'SUPER_ADMIN' ? id : userTenantId;
    return this.tenantService.updateSubscription(tenantId, updateSubscriptionDto);
  }

  @Patch(':id/suspend')
  @Roles('SUPER_ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Suspend tenant' })
  @ApiResponse({ status: 200, description: 'Tenant suspended successfully' })
  async suspend(@Param('id') id: string, @Body() body?: { reason?: string }) {
    return this.tenantService.suspend(id, body?.reason);
  }

  @Patch(':id/activate')
  @Roles('SUPER_ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Activate tenant' })
  @ApiResponse({ status: 200, description: 'Tenant activated successfully' })
  async activate(@Param('id') id: string) {
    return this.tenantService.activate(id);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete tenant' })
  @ApiResponse({ status: 204, description: 'Tenant deleted successfully' })
  async delete(@Param('id') id: string) {
    await this.tenantService.delete(id);
  }

  @Get(':id/stats')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Get tenant statistics' })
  @ApiResponse({ status: 200, description: 'Returns tenant usage statistics' })
  async getStats(
    @Param('id') id: string,
    @CurrentUser('tenantId') userTenantId: string,
    @CurrentUser('role') userRole: string,
  ) {
    const tenantId = userRole === 'SUPER_ADMIN' ? id : userTenantId;
    return this.tenantService.getStats(tenantId);
  }
}
