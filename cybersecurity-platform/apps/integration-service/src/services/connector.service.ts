import { DatabaseService } from '@app/database';
import { LoggerService } from '@app/logging';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateConnectorDto } from '../dto/connector.dto';

@Injectable()
export class ConnectorService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly logger: LoggerService,
  ) {}

  async create(tenantId: string, dto: CreateConnectorDto) {
    const connector = await this.prisma.integration.create({
      data: {
        tenantId,
        name: dto.name,
        type: dto.type,
        config: dto.config || {},
      },
    });
    this.logger.log(`Connector created: ${connector.id}`, 'ConnectorService');
    return connector;
  }

  async list(tenantId: string) {
    return this.prisma.integration.findMany({ where: { tenantId } });
  }

  async update(id: string, dto: Partial<CreateConnectorDto>) {
    const existing = await this.prisma.integration.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Connector not found');

    const updated = await this.prisma.integration.update({ where: { id }, data: { ...dto } });
    this.logger.log(`Connector updated: ${id}`, 'ConnectorService');
    return updated;
  }

  async delete(id: string) {
    const existing = await this.prisma.integration.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Connector not found');
    await this.prisma.integration.delete({ where: { id } });
    this.logger.log(`Connector deleted: ${id}`, 'ConnectorService');
    return { success: true };
  }
}
