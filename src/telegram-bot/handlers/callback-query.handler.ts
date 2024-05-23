import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { CourseService } from '../../course/course.service';
import { TelegramUtilsService } from '../telegram-utils.service';

@Injectable()
export class CallbackQueryHandler {
  constructor(
    private courseService: CourseService,
    private utilsService: TelegramUtilsService,
  ) {}

  async handleCallbackQuery(
    callbackQuery: TelegramBot.CallbackQuery,
    bot: TelegramBot,
  ) {
    const message = callbackQuery.message;
    const data = callbackQuery.data;
    const from = callbackQuery.from;
    const chatId = message.chat.id;
    const userId = from.id;
    const webAppUrl = this.utilsService.getWebUrl(userId);

    if (data === '/create') {
      await bot.sendMessage(
        chatId,
        `🖊️ Let's embark on the journey of creating your new course! Tap below to get started! 🚀`,
        this.utilsService.getOptions('create', webAppUrl),
      );
    } else if (data === '/mycreatedcourses') {
      await bot.sendMessage(
        chatId,
        '👀 Looking to update your courses? Tap here to review and modify them! ✏️',
        this.utilsService.getOptions('mycreatedcourses', webAppUrl, userId),
      );
    }

    const arrData = data.split(' ');
    const type = arrData[0];
    const method = arrData[1];
    const id = arrData[2];

    switch (type) {
      case 'COURSE':
        if (method === 'DELETE') {
          const deletedCourse = await this.courseService.delete({ id, userId });
          if (deletedCourse) {
            await bot.sendMessage(
              chatId,
              `Your course "${deletedCourse.name}" and all its contents have been successfully deleted! 💔`,
            );
          } else {
            await bot.sendMessage(
              chatId,
              '🚫 Sorry, there was an error trying to delete the course. Could you please try again? 🔄',
              this.utilsService.getRetryOptions(),
            );
          }
        }
        break;
      default:
        console.log('Unhandled callback data');
    }
  }
}
