import { AuthModule, JwtAuthGuard, RolesGuard } from '@app/auth';
import { DatabaseModule } from '@app/database';
import { LoggingModule } from '@app/logging';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ApiKeysController } from './controllers/api-keys.controller';
import { ConnectorsController } from './controllers/connectors.controller';
import { HealthController } from './controllers/health.controller';
import { WebhooksController } from './controllers/webhooks.controller';
import { ApiKeyService } from './services/api-key.service';
import { ConnectorService } from './services/connector.service';
import { WebhookService } from './services/webhook.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    LoggingModule,
    AuthModule,
  ],
  controllers: [HealthController, ApiKeysController, WebhooksController, ConnectorsController],
  providers: [
    ApiKeyService,
    WebhookService,
    ConnectorService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class IntegrationServiceModule {}
