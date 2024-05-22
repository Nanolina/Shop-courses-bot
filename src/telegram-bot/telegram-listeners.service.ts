import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { CourseService } from '../course/course.service';
import { TRY_AGAIN_ERROR } from './consts';
import { TelegramUtilsService } from './telegram-utils.service';

@Injectable()
export class TelegramListenersService {
  constructor(
    private courseService: CourseService,
    private utilsService: TelegramUtilsService,
  ) {}

  setupListeners(bot: TelegramBot) {
    bot.on('message', async (msg) => {
      const { chat, from, text, web_app_data } = msg;
      const chatId = chat.id;
      const userId = from.id;
      const dataFromWeb = web_app_data?.data;
      const webAppUrl = this.utilsService.getWebUrl(userId);

      if (!userId) {
        await bot.sendMessage(
          chatId,
          '❌ Oops! You are unauthorized 😢',
          this.utilsService.getOptions('start', webAppUrl),
        );
      }

      switch (text) {
        case '/create':
          await bot.sendMessage(
            chatId,
            '✍️ Ready to create your own online course? Click below! 📝',
            this.utilsService.getOptions('create', webAppUrl),
          );
          break;
        case '/mycreatedcourses':
          await bot.sendMessage(
            chatId,
            '✍️ Want to change your course? Click below! 📝',
            this.utilsService.getOptions('mycreatedcourses', webAppUrl, userId),
          );
          break;
        case '/start':
          await bot.sendMessage(
            chatId,
            '🛒 Looking to buy an online course? Start here! 🎓',
            this.utilsService.getOptions('start', webAppUrl),
          );
          break;
        case '/module':
          await bot.sendMessage(
            chatId,
            '✍️ Ready to create modules? Click below! 📝',
            this.utilsService.getOptions('module', webAppUrl),
          );
          break;
      }

      // Process web_app data
      if (dataFromWeb) {
        try {
          const data = JSON.parse(dataFromWeb);
          const course = await this.courseService.create({
            ...data,
            userId,
          });
          if (course) {
            await bot.sendMessage(
              chatId,
              `🎉 Congrats! Your ${data.name} course is ready! 🌟 Now, let's add some visuals! 📸 Send me a photo!`,
            );
          } else {
            await bot.sendMessage(
              chatId,
              TRY_AGAIN_ERROR,
              this.utilsService.getRetryOptions(),
            );
          }
        } catch (error) {
          await bot.sendMessage(
            chatId,
            TRY_AGAIN_ERROR,
            this.utilsService.getRetryOptions(),
          );
        }
      }
    });

    bot.on('callback_query', async (callbackQuery) => {
      const { message, data } = callbackQuery;
      const chatId = message.chat.id;
      console.log('message', message);
      const webAppUrl = this.utilsService.getWebUrl(message.userId);
      if (data === '/create') {
        await bot.sendMessage(
          chatId,
          '📝 Let’s start creating your new course! 🎨',
          this.utilsService.getOptions('create', webAppUrl),
        );
      }
    });
  }
}
