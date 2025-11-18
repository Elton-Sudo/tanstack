import { LoggerService } from '@app/logging';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AnalyticsServiceModule } from './analytics-service.module';

async function bootstrap() {
  const app = await NestFactory.create(AnalyticsServiceModule, {
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
    .setTitle('Analytics Service API')
    .setDescription('Analytics and reporting data API')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('analytics')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.ANALYTICS_SERVICE_PORT || 3005;
  await app.listen(port);

  logger.log(`Analytics Service is running on: http://localhost:${port}`, 'Bootstrap');
  logger.log(`Swagger docs available at: http://localhost:${port}/api/docs`, 'Bootstrap');
}

bootstrap();
