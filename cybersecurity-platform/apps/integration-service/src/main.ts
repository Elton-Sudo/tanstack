import { LoggerService } from '@app/logging';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { IntegrationServiceModule } from './integration-service.module';

async function bootstrap() {
  const app = await NestFactory.create(IntegrationServiceModule, {
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
    .setTitle('Integration Service API')
    .setDescription('Third-party integration API')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('integrations')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.INTEGRATION_SERVICE_PORT || 3009;
  await app.listen(port);

  logger.log(`Integration Service is running on: http://localhost:${port}`, 'Bootstrap');
  logger.log(`Swagger docs available at: http://localhost:${port}/api/docs`, 'Bootstrap');
}

bootstrap();
