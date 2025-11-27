import { DatabaseService } from '@app/database';
import { LoggerService } from '@app/logging';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWebhookDto } from '../dto/webhook.dto';

@Injectable()
export class WebhookService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly logger: LoggerService,
  ) {}

  async create(tenantId: string, dto: CreateWebhookDto) {
    const secret = dto.secret || Math.random().toString(36).substring(2, 12);
    const webhook = await this.prisma.webhook.create({
      data: {
        tenantId,
        url: dto.url,
        events: dto.events,
        secret,
      },
    });
    this.logger.log(`Webhook created: ${webhook.id}`, 'WebhookService');
    return webhook;
  }

  async list(tenantId: string) {
    return this.prisma.webhook.findMany({ where: { tenantId } });
  }

  async delete(id: string) {
    const webhook = await this.prisma.webhook.findUnique({ where: { id } });
    if (!webhook) throw new NotFoundException('Webhook not found');
    await this.prisma.webhook.delete({ where: { id } });
    this.logger.log(`Webhook deleted: ${id}`, 'WebhookService');
    return { success: true };
  }

  async trigger(id: string, payload: any) {
    const hook = await this.prisma.webhook.findUnique({ where: { id } });
    if (!hook) throw new NotFoundException('Webhook not found');
    // For now, we will log the event; actual HTTP dispatching can be added later.
    this.logger.log(`Triggering webhook: ${id} -> ${hook.url}`, 'WebhookService');
    await this.prisma.webhook.update({
      where: { id },
      data: { lastTriggeredAt: new Date(), failureCount: 0 },
    });
    return { success: true };
  }
}
