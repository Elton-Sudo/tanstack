import { DatabaseModule } from '@app/database';
import { LoggingModule } from '@app/logging';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './controllers/health.controller';
import { ReportController } from './controllers/report.controller';
import { ReportGeneratorService } from './services/report-generator.service';
import { ReportSchedulerService } from './services/report-scheduler.service';
import { ReportService } from './services/report.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    LoggingModule,
  ],
  controllers: [HealthController, ReportController],
  providers: [ReportService, ReportGeneratorService, ReportSchedulerService],
})
export class ReportingServiceModule {}
