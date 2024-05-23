import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { LessonService } from '../../lesson/lesson.service';
import { TRY_AGAIN_ERROR } from '../consts';
import { TelegramUtilsService } from '../telegram-utils.service';

@Injectable()
export class LessonHandlers {
  constructor(
    private lessonService: LessonService,
    private utilsService: TelegramUtilsService,
  ) {}

  async handleCreateLesson(
    chatId: number,
    userId: number,
    data: any,
    bot: TelegramBot,
  ) {
    const createdLesson = await this.lessonService.create({
      ...data,
      userId,
      moduleId: data.parentId,
    });
    if (createdLesson) {
      await bot.sendMessage(
        chatId,
        `🌟 Fantastic! Your lesson titled "${data.name}" is all set and ready to go! 🚀`,
      );
    } else {
      await bot.sendMessage(
        chatId,
        TRY_AGAIN_ERROR,
        this.utilsService.getRetryOptions(),
      );
    }
  }

  async handleUpdateLesson(
    chatId: number,
    userId: number,
    data: any,
    bot: TelegramBot,
  ) {
    const updatedLesson = await this.lessonService.update({
      ...data,
      userId,
      moduleId: data.parentId,
    });
    if (updatedLesson) {
      await bot.sendMessage(
        chatId,
        `🌟 Great job! Your lesson "${data.name}" has been updated successfully. Keep making progress! ✨`,
      );
    } else {
      await bot.sendMessage(
        chatId,
        TRY_AGAIN_ERROR,
        this.utilsService.getRetryOptions(),
      );
    }
  }
}
