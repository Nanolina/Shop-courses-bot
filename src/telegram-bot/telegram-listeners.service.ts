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
      const language = from.language_code;
      const webAppUrl = this.utilsService.getWebUrl(userId);

      if (!userId) {
        await bot.sendMessage(
          chatId,
          '❌ Oops! You are unauthorized 😢',
          this.utilsService.getOptions('start', webAppUrl, 'en'), // Default to English
        );
      }

      await this.textCommandHandler.handleTextCommand({
        text,
        userId,
        chatId,
        bot,
        webAppUrl,
        language,
      });
    });

    bot.on('contact', async (msg) => {
      const { chat, from } = msg;
      const chatId = chat.id;
      const language = from.language_code;
      const webAppUrl = this.utilsService.getWebUrl(from.id);
      const phone = msg.contact.phone_number;

      if (phone) {
        await this.textCommandHandler.handlePhoneMessage({
          phone,
          user: from,
          chatId,
          bot,
          webAppUrl,
          language,
        });
      }
    });
  }
}
