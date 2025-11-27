import { AuthModule, JwtAuthGuard, RolesGuard } from '@app/auth';
import { DatabaseModule } from '@app/database';
import { LoggingModule } from '@app/logging';
import { MessagingModule } from '@app/messaging';
import { MonitoringModule } from '@app/monitoring';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuditController } from './controllers/audit.controller';
import { AuthController } from './controllers/auth.controller';
import { MfaController } from './controllers/mfa.controller';
import { PasswordController } from './controllers/password.controller';
import { SessionController } from './controllers/session.controller';
import { SsoController } from './controllers/sso.controller';
import { UserController } from './controllers/user.controller';
import { AuditService } from './services/audit.service';
import { AuthService } from './services/auth.service';
import { MfaService } from './services/mfa.service';
import { PasswordService } from './services/password.service';
import { SessionService } from './services/session.service';
import { SsoService } from './services/sso.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        '../../.env', // project root .env
        '.env', // local service .env
      ],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    EventEmitterModule.forRoot(),
    DatabaseModule,
    LoggingModule,
    MonitoringModule,
    MessagingModule,
    AuthModule,
  ],
  controllers: [
    AuthController,
    UserController,
    MfaController,
    PasswordController,
    SessionController,
    AuditController,
    SsoController,
  ],
  providers: [
    AuthService,
    MfaService,
    PasswordService,
    SessionService,
    AuditService,
    SsoService,
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
})
export class AuthServiceModule {}
