import { DatabaseModule } from '@app/database';
import { LoggingModule } from '@app/logging';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './controllers/health.controller';
import { NotificationController } from './controllers/notification.controller';
import { EmailService } from './services/email.service';
import { NotificationService } from './services/notification.service';
import { PushNotificationService } from './services/push-notification.service';
import { SmsService } from './services/sms.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    LoggingModule,
  ],
  controllers: [HealthController, NotificationController],
  providers: [NotificationService, EmailService, SmsService, PushNotificationService],
})
export class NotificationServiceModule {}
