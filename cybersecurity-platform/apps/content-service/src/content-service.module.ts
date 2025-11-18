import { DatabaseModule } from '@app/database';
import { LoggingModule } from '@app/logging';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ContentController } from './controllers/content.controller';
import { HealthController } from './controllers/health.controller';
import { ContentService } from './services/content.service';
import { StorageService } from './services/storage.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    LoggingModule,
  ],
  controllers: [HealthController, ContentController],
  providers: [ContentService, StorageService],
})
export class ContentServiceModule {}
