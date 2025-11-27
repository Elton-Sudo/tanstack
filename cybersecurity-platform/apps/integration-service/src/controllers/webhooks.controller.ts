import { JwtAuthGuard } from '@app/auth';
import { CurrentUser, TenantGuard } from '@app/common';
import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateWebhookDto } from '../dto/webhook.dto';
import { WebhookService } from '../services/webhook.service';

@ApiTags('integration/webhooks')
@Controller('webhooks')
@UseGuards(JwtAuthGuard, TenantGuard)
@ApiBearerAuth()
export class WebhooksController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  @ApiOperation({ summary: 'Create webhook' })
  @ApiResponse({ status: 201 })
  async create(@Body() dto: CreateWebhookDto, @CurrentUser('tenantId') tenantId: string) {
    return this.webhookService.create(tenantId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List webhooks for tenant' })
  @ApiResponse({ status: 200 })
  async list(@CurrentUser('tenantId') tenantId: string) {
    return this.webhookService.list(tenantId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete webhook' })
  @ApiResponse({ status: 200 })
  async delete(@Param('id') id: string) {
    return this.webhookService.delete(id);
  }

  @Post(':id/trigger')
  @ApiOperation({ summary: 'Trigger a webhook' })
  @ApiResponse({ status: 200 })
  async trigger(@Param('id') id: string, @Body() payload: any) {
    return this.webhookService.trigger(id, payload);
  }
}
