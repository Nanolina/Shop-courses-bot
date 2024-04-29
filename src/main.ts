import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Config
  const configService = app.get(ConfigService);

  // Cors
  app.enableCors();

  // Validation
  app.useGlobalPipes(new ValidationPipe());

  // Listen
  const port = configService.get<number>('PORT') || 8000;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
