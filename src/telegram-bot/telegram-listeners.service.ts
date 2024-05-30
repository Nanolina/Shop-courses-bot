import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { CREATE, LESSON, UPDATE } from '../consts';
import { TRY_AGAIN_ERROR } from './consts';
import {
  CallbackQueryHandler,
  LessonHandlers,
  TextCommandHandler,
} from './handlers';
import { TelegramUtilsService } from './telegram-utils.service';

@Injectable()
export class TelegramListenersService {
  constructor(
    private utilsService: TelegramUtilsService,

    private lessonHandlers: LessonHandlers,
    private textCommandHandler: TextCommandHandler,
    private callbackQueryHandler: CallbackQueryHandler,
  ) {}

  async handleLessonData(data, chatId, userId, bot) {
    switch (data.method) {
      case CREATE:
        await this.lessonHandlers.handleCreateLesson(chatId, userId, data, bot);
        break;
      case UPDATE:
        await this.lessonHandlers.handleUpdateLesson(chatId, userId, data, bot);
        break;
      default:
        await bot.sendMessage(chatId, 'Okay');
    }
  }

  setupListeners(bot: TelegramBot) {
    bot.on('message', async (msg) => {
      const { chat, from, text, web_app_data } = msg;
      const chatId = chat.id;
      const userId = from.id;
      console.log('msg', msg);
      const dataFromWeb = web_app_data?.data;
      const webAppUrl = this.utilsService.getWebUrl(userId);

      if (!userId) {
        await bot.sendMessage(
          chatId,
          '❌ Oops! You are unauthorized 😢',
          this.utilsService.getOptions('start', webAppUrl),
        );
      }

      await this.textCommandHandler.handleTextCommand(
        text,
        chatId,
        userId,
        bot,
        webAppUrl,
      );

      // Process web_app data
      if (dataFromWeb) {
        let data;
        try {
          data = JSON.parse(dataFromWeb);
        } catch (error) {
          await bot.sendMessage(
            chatId,
            TRY_AGAIN_ERROR,
            this.utilsService.getRetryOptions(),
          );
        }

        switch (data.type) {
          case LESSON:
            this.handleLessonData(data, chatId, userId, bot);
            break;
        }
      }
    });

    bot.on('callback_query', async (callbackQuery) => {
      await this.callbackQueryHandler.handleCallbackQuery(callbackQuery, bot);
    });
  }
}
