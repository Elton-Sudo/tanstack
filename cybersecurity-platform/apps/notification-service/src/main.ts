import { LoggerService } from '@app/logging';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NotificationServiceModule } from './notification-service.module';

async function bootstrap() {
  const app = await NestFactory.create(NotificationServiceModule, {
    bufferLogs: true,
  });

  const logger = app.get(LoggerService);
  app.useLogger(logger);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Notification Service API')
    .setDescription('Notification and messaging API')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('notifications')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.NOTIFICATION_SERVICE_PORT || 3008;
  await app.listen(port);

  logger.log(`Notification Service is running on: http://localhost:${port}`, 'Bootstrap');
  logger.log(`Swagger docs available at: http://localhost:${port}/api/docs`, 'Bootstrap');
}

bootstrap();
