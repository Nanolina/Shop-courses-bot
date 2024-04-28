import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CourseService } from './course/course.service';
import { ImageService } from './image/image.service';
import { LoggerModule } from './logger/logger.module';
import { PrismaService } from './prisma/prisma.service';
import { RedisAppModule } from './redis/redis.module';
import { TelegramBotService } from './telegram-bot/telegram-bot.service';

@Module({
  imports: [
    RedisAppModule,
    CloudinaryModule,
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [
    AppService,
    PrismaService,
    TelegramBotService,
    CourseService,
    ImageService,
  ],
})
export class AppModule {}
