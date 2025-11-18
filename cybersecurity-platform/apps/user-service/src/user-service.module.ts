import { Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from '@app/database';
import { LoggingModule } from '@app/logging';
import { MonitoringModule } from '@app/monitoring';
import { MessagingModule } from '@app/messaging';
import { AuthModule, JwtAuthGuard, RolesGuard } from '@app/auth';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { APP_GUARD } from '@nestjs/core';

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
