import { DatabaseService } from '@app/database';
import { LoggerService } from '@app/logging';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateApiKeyDto } from '../dto/api-key.dto';

@Injectable()
export class ApiKeyService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly logger: LoggerService,
  ) {}

  async create(userId: string, tenantId: string, dto: CreateApiKeyDto) {
    // generate secret key
    const key = `${uuidv4()}.${Math.random().toString(36).substring(2, 12)}`;

    const apiKey = await this.prisma.apiKey.create({
      data: {
        userId,
        tenantId,
        name: dto.name,
        key,
        isActive: dto.isActive ?? true,
        permissions: dto.permissions ?? [],
      },
    });

    this.logger.log(`API key created: ${apiKey.id}`, 'ApiKeyService');
    return apiKey;
  }

  async list(tenantId: string) {
    return this.prisma.apiKey.findMany({ where: { tenantId } });
  }

  async revoke(id: string) {
    const deleted = await this.prisma.apiKey.update({ where: { id }, data: { isActive: false } });
    this.logger.warn(`API key revoked: ${id}`, 'ApiKeyService');
    return deleted;
  }
}
