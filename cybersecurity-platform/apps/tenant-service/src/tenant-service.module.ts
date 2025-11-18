import { AuthModule, JwtAuthGuard, RolesGuard } from '@app/auth';
import { DatabaseModule } from '@app/database';
import { LoggingModule } from '@app/logging';
import { MessagingModule } from '@app/messaging';
import { MonitoringModule } from '@app/monitoring';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TenantController } from './controllers/tenant.controller';
import { TenantCronService } from './services/tenant-cron.service';
import { TenantService } from './services/tenant.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    ScheduleModule.forRoot(),
    DatabaseModule,
    LoggingModule,
    MonitoringModule,
    MessagingModule,
    AuthModule,
  ],
  controllers: [TenantController],
  providers: [
    TenantService,
    TenantCronService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [TenantService],
})
export class TenantServiceModule {}
