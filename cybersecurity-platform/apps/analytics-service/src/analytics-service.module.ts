import { DatabaseModule } from '@app/database';
import { LoggingModule } from '@app/logging';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AnalyticsController } from './controllers/analytics.controller';
import { HealthController } from './controllers/health.controller';
import { AnalyticsService } from './services/analytics.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    LoggingModule,
  ],
  controllers: [HealthController, AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsServiceModule {}
