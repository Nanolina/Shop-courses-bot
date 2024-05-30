import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { TelegramUtilsService } from '../telegram-utils.service';

@Injectable()
export class CallbackQueryHandler {
  constructor(private utilsService: TelegramUtilsService) {}

  async handleCallbackQuery(
    callbackQuery: TelegramBot.CallbackQuery,
    bot: TelegramBot,
  ) {
    const { message, data, from } = callbackQuery;
    const chatId = message.chat.id;
    const userId = from.id;
    const webAppUrl = this.utilsService.getWebUrl(userId);

    if (data === '/create') {
      await bot.sendMessage(
        chatId,
        `🖊️ Let's embark on the journey of creating your new course! Tap below to get started! 🚀`,
        this.utilsService.getOptions('create', webAppUrl),
      );
    }
  }
}
