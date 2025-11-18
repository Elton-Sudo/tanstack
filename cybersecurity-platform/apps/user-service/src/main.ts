import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UserServiceModule } from './user-service.module';
import { LoggerService } from '@app/logging';

async function bootstrap() {
  const app = await NestFactory.create(UserServiceModule, {
    bufferLogs: true,
  });

  // Use custom logger
  const logger = app.get(LoggerService);
  app.useLogger(logger);

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  });

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('User Service API')
    .setDescription('User management and administration API')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('users')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.USER_SERVICE_PORT || 3003;
  await app.listen(port);

  logger.log(`User Service is running on: http://localhost:${port}`, 'Bootstrap');
  logger.log(`Swagger docs available at: http://localhost:${port}/api/docs`, 'Bootstrap');
}

bootstrap();
