import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { CallbackQueryHandler, TextCommandHandler } from './handlers';
import { TelegramUtilsService } from './telegram-utils.service';

@Injectable()
export class TelegramListenersService {
  constructor(
    private utilsService: TelegramUtilsService,
    private textCommandHandler: TextCommandHandler,
    private callbackQueryHandler: CallbackQueryHandler,
  ) {}

  setupListeners(bot: TelegramBot) {
    bot.on('message', async (msg) => {
      const { chat, from, text } = msg;
      const chatId = chat.id;
      const userId = from.id;
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
        bot,
        webAppUrl,
      );
    });

    bot.on('callback_query', async (callbackQuery) => {
      await this.callbackQueryHandler.handleCallbackQuery(callbackQuery, bot);
    });
  }
}
