import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LessonService } from 'src/lesson/lesson.service';
import { ModuleService } from 'src/module/module.service';
import { CourseModule } from '../course/course.module';
import { CourseService } from '../course/course.service';
import { LoggerModule } from '../logger/logger.module';
import { PrismaService } from '../prisma/prisma.service';
import {
  CallbackQueryHandler,
  CourseHandlers,
  LessonHandlers,
  ModuleHandlers,
  TextCommandHandler,
} from './handlers';
import { TelegramBotService } from './telegram-bot.service';
import { TelegramListenersService } from './telegram-listeners.service';
import { TelegramUtilsService } from './telegram-utils.service';

@Module({
  imports: [ConfigModule, CourseModule, LoggerModule],
  providers: [
    TelegramBotService,
    TelegramListenersService,
    TelegramUtilsService,
    PrismaService,
    CourseService,
    ModuleService,
    LessonService,
    CourseHandlers,
    ModuleHandlers,
    LessonHandlers,
    TextCommandHandler,
    CallbackQueryHandler,
  ],
  exports: [TelegramBotService],
})
export class TelegramModule {}
