import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health/health.controller';
import { MetricsService } from './metrics/metrics.service';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [MetricsService],
  exports: [MetricsService],
})
export class MonitoringModule {}
