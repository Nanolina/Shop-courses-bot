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
  ) {
    switch (text) {
      case '/create':
        await bot.sendMessage(
          chatId,
          '🌱 Are you ready to bring your course ideas to life? Tap here and let’s get started creating something amazing together! 📝',
          this.utilsService.getOptions('create', webAppUrl),
        );
        break;
      case '/createdcourses':
        await bot.sendMessage(
          chatId,
          '🔧 Ready to tweak your existing courses? Just click here and make all the adjustments you need! ✍️',
          this.utilsService.getOptions('createdcourses', webAppUrl),
        );
        break;
      case '/purchasedcourses':
        await bot.sendMessage(
          chatId,
          '📘 Here are the courses you’ve purchased! Click here to explore them. 🚀',
          this.utilsService.getOptions('purchasedcourses', webAppUrl),
        );
        break;
      case '/start':
      default:
        await bot.sendMessage(
          chatId,
          '🚀 Eager to explore new learning opportunities? Click here to start your journey through our diverse course offerings! 🎓',
          this.utilsService.getOptions('start', webAppUrl),
        );
        break;
    }
  }
}
