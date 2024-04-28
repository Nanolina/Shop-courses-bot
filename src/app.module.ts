import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { CourseService } from './course/course.service';
import { LoggerModule } from './logger/logger.module';
import { PrismaService } from './prisma/prisma.service';
import { TelegramBotService } from './telegram-bot/telegram-bot.service';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [AppService, PrismaService, TelegramBotService, CourseService],
})
export class AppModule {}
