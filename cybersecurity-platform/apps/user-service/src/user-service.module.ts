import { AuthModule, JwtAuthGuard, RolesGuard } from '@app/auth';
import { DatabaseModule } from '@app/database';
import { LoggingModule } from '@app/logging';
import { MessagingModule } from '@app/messaging';
import { MonitoringModule } from '@app/monitoring';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';

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
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    JwtAuthGuard,
    RolesGuard,
  ],
  exports: [UserService],
})
export class UserServiceModule {}
