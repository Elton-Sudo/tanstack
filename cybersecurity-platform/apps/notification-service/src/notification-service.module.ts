import { DatabaseModule } from '@app/database';
import { LoggingModule } from '@app/logging';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './controllers/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    LoggingModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class NotificationServiceModule {}
