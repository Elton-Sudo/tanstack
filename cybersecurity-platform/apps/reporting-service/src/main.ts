import { LoggerService } from '@app/logging';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ReportingServiceModule } from './reporting-service.module';

async function bootstrap() {
  const app = await NestFactory.create(ReportingServiceModule, {
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
    .setTitle('Reporting Service API')
    .setDescription('Reports and analytics generation API')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('reporting')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.REPORTING_SERVICE_PORT || 3007;
  await app.listen(port);

  logger.log(`Reporting Service is running on: http://localhost:${port}`, 'Bootstrap');
  logger.log(`Swagger docs available at: http://localhost:${port}/api/docs`, 'Bootstrap');
}

bootstrap();
