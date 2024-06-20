import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { TextCommandHandler } from './handlers';
import { TelegramUtilsService } from './telegram-utils.service';

@Injectable()
export class TelegramListenersService {
  constructor(
    private utilsService: TelegramUtilsService,
    private textCommandHandler: TextCommandHandler,
  ) {}

  setupListeners(bot: TelegramBot) {
    bot.on('message', async (msg) => {
      const { chat, from, text } = msg;
      const chatId = chat.id;
      const userId = from.id;
      const languageCode = from.language_code;
      const webAppUrl = this.utilsService.getWebUrl(userId);

      if (!userId) {
        await bot.sendMessage(
          chatId,
          '❌ Oops! You are unauthorized 😢',
          this.utilsService.getOptions('start', webAppUrl, 'en'), // Default to English
        );
      }

      await this.textCommandHandler.handleTextCommand(
        text,
        chatId,
        bot,
        webAppUrl,
        languageCode,
      );
    });
  }
}
