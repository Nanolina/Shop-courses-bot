import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as TelegramBot from 'node-telegram-bot-api';
import { CourseService } from '../course/course.service';

@Injectable()
export class TelegramBotService implements OnModuleInit {
  private bot: TelegramBot;
  private readonly webAppURL: string;

  constructor(
    private configService: ConfigService,
    private courseService: CourseService,
  ) {
    this.webAppURL = this.configService.get<string>('WEB_APP_URL');
    if (!this.webAppURL) {
      throw new Error('WEB_APP_URL is not defined in the env');
    }
  }

  onModuleInit() {
    const token = this.configService.get<string>('BOT_TOKEN');
    if (!token) {
      throw new Error('BOT_TOKEN is not defined in the env');
    }

    this.bot = new TelegramBot(token, { polling: true });
    this.setupListeners();
  }

  private setupListeners() {
    this.bot.on('message', async (msg) => {
      const chatId = msg.chat.id;
      const text = msg.text;

      switch (text) {
        case '/create':
          console.log('create');
          await this.bot.sendMessage(
            chatId,
            '✍️ Click the button below if you want to create your own online course',
            this.getOptions('create'),
          );
          break;

        case '/start':
        default:
          console.log('start');
          await this.bot.sendMessage(
            chatId,
            '🛒 Click the button below if you want to buy an online course',
            this.getOptions('start'),
          );
          break;
      }

      if (msg?.web_app_data?.data) {
        try {
          const data = JSON.parse(msg.web_app_data.data);
          console.log('msg', msg);
          console.log('data', data);

          try {
            await this.courseService.create({
              ...data,
              userId: msg.from.id,
              userName: msg.from.first_name,
            });
          } catch (error) {
            throw new InternalServerErrorException(
              'Something went wrong, please try again',
              error?.message,
            );
          }

          await this.bot.sendMessage(
            chatId,
            `🎉 You have successfully created the ${data?.shortTitle} course! Now let's add a video. You can submit the video right away or start by creating a title for the module. If you submit a video without first creating a title for the module, all videos will be saved in one common module.`,
          );
        } catch (error) {
          console.error(error);
        }
      }
    });
  }

  private getOptions(type: string) {
    let url;
    let text;
    let typeKeyboard;

    switch (type) {
      case 'create':
        url = `${this.webAppURL}/create`;
        text = '📝 Please fill out the form to create a course.';
        typeKeyboard = 'keyboard';
        break;
      default:
      case 'start':
        url = this.webAppURL;
        text = '📚 View courses';
        typeKeyboard = 'inline_keyboard';
        break;
    }

    return {
      reply_markup: {
        [typeKeyboard]: [[{ text, web_app: { url } }]],
      },
    };
  }
}
