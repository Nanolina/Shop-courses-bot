import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { TelegramUtilsService } from '../telegram-utils.service';

@Injectable()
export class TextCommandHandler {
  constructor(private utilsService: TelegramUtilsService) {}

  async handleTextCommand(
    text: string,
    chatId: number,
    bot: TelegramBot,
    webAppUrl: string,
    language: string,
  ) {
    let message;
    switch (text) {
      case '/create':
        message = this.utilsService.getTranslatedMessage(
          language,
          'create',
          '🌱',
          '📝',
        );
        await bot.sendMessage(
          chatId,
          message,
          this.utilsService.getOptions('create', webAppUrl, language),
        );
        break;
      case '/createdcourses':
        message = this.utilsService.getTranslatedMessage(
          language,
          'created_courses',
          '🔧',
          '✍️',
        );
        await bot.sendMessage(
          chatId,
          message,
          this.utilsService.getOptions('createdcourses', webAppUrl, language),
        );
        break;
      case '/purchasedcourses':
        message = this.utilsService.getTranslatedMessage(
          language,
          'purchased_courses',
          '📘',
          '🚀',
        );
        await bot.sendMessage(
          chatId,
          message,
          this.utilsService.getOptions('purchasedcourses', webAppUrl, language),
        );
        break;
      case '/start':
      default:
        message = this.utilsService.getTranslatedMessage(
          language,
          'start',
          '🚀',
          '🎓',
        );
        await bot.sendMessage(
          chatId,
          message,
          this.utilsService.getOptions('start', webAppUrl, language),
        );
        break;
    }
  }
}
