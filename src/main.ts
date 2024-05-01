import { ValidationPipe } from '@nestjs/common';
import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { readFileSync } from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  const pathPrivateKey = process.env.PATH_PRIVATE_KEY;
  const pathCertificate = process.env.PATH_CERTIFICATE;

  // const httpsOptions: HttpsOptions = {
  //   key: readFileSync(pathPrivateKey),
  //   cert: readFileSync(pathCertificate),
  // };

  const app = await NestFactory.create(AppModule, { cors: true });

  // Config
  const configService = app.get(ConfigService);

  // Validation
  app.useGlobalPipes(new ValidationPipe());

  // Listen
  const port = configService.get<number>('PORT') || 8000;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
