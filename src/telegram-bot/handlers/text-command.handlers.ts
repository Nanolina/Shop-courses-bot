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
          "🌱 Ready to bring your course ideas to life? Click the button below and let's create something helpful together! 📝",
          this.utilsService.getOptions('create', webAppUrl),
        );
        break;
      case '/createdcourses':
        await bot.sendMessage(
          chatId,
          '🔧 Ready to make changes to your created courses? Just click below and make any necessary adjustments! ✍️',
          this.utilsService.getOptions('createdcourses', webAppUrl),
        );
        break;
      case '/purchasedcourses':
        await bot.sendMessage(
          chatId,
          '📘 Click the button below and start learning your courses today! 🚀',
          this.utilsService.getOptions('purchasedcourses', webAppUrl),
        );
        break;
      case '/start':
      default:
        await bot.sendMessage(
          chatId,
          '🚀 Hungry for new learning opportunities? Click here to start your journey through our diverse course offerings! 🎓',
          this.utilsService.getOptions('start', webAppUrl),
        );
        break;
    }
  }
}
