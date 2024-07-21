import { ValidationPipe } from '@nestjs/common';
import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { AppModule } from './app.module';
config();

async function bootstrap() {
  // Config
  const configService = new ConfigService();

  // Urls for cors
  const webAppUrls = [
    configService.get<string>('WEB_APP_URL_ALINA'),
    configService.get<string>('WEB_APP_URL_SNEZHANNA'),
    configService.get<string>('WEB_APP_URL'),
  ];

  let appOptions = {};

  // Https
  if (process.env.ENABLE_HTTPS === 'true') {
    const pathPrivateKey = process.env.PATH_PRIVATE_KEY;
    const pathCertificate = process.env.PATH_CERTIFICATE;
    const httpsOptions: HttpsOptions = {
      key: readFileSync(pathPrivateKey),
      cert: readFileSync(pathCertificate),
    };
    appOptions = { httpsOptions };
  }

  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: webAppUrls,
    },
    ...appOptions,
  });

  // Validation
  app.useGlobalPipes(new ValidationPipe());

  // For userId type
  BigInt.prototype.toJSON = function () {
    const int = Number.parseInt(this.toString());
    return int ?? this.toString();
  };

  // Listen
  const port = configService.get<number>('PORT') || 8000;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
