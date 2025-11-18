import { AuthModule, JwtAuthGuard, RolesGuard } from '@app/auth';
import { DatabaseModule } from '@app/database';
import { LoggingModule } from '@app/logging';
import { MessagingModule } from '@app/messaging';
import { MonitoringModule } from '@app/monitoring';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { CourseController } from './controllers/course.controller';
import { CourseService } from './services/course.service';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    DatabaseModule,
    LoggingModule,
    MonitoringModule,
    MessagingModule,
    AuthModule,
  ],
  controllers: [CourseController],
  providers: [
    CourseService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    JwtAuthGuard,
    RolesGuard,
  ],
  exports: [CourseService],
})
export class CourseServiceModule {}
