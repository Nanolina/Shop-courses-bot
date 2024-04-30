import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TelegramBotService implements OnModuleInit {
  private bot: TelegramBot;
  private readonly webAppURL: string;

  constructor(
    private configService: ConfigService,
    @InjectRedis() private readonly redisClient: Redis,
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

      // Check text commands
      const text = msg.text;
      switch (text) {
        case '/create':
          await this.bot.sendMessage(
            chatId,
            '✍️ Click the button below if you want to create your own online course',
            this.getOptions('create'),
          );
          break;

        case '/start':
          await this.bot.sendMessage(
            chatId,
            '🛒 Click the button below if you want to buy an online course',
            this.getOptions('start'),
          );
          break;
      }
    });

    // Callback request handler for inline buttons
    this.bot.on('callback_query', async (callbackQuery) => {
      const message = callbackQuery.message;
      const data = callbackQuery.data;
      const chatId = message.chat.id;

      if (data === '/create') {
        // Clicking the button to create a course
        await this.bot.sendMessage(
          chatId,
          '📝 Please fill out the form to create a course.',
          this.getOptions('create'),
        );
      }
    });
  }

  private getOptions(type: string) {
    let url;
    let text;

    switch (type) {
      case 'create':
        url = `${this.webAppURL}/create`;
        text = '📝 Сreate a course';
        break;
      case 'start':
      default:
        url = this.webAppURL;
        text = '📚 View courses';
        break;
    }

    return {
      reply_markup: {
        inline_keyboard: [[{ text, web_app: { url } }]],
      },
    };
  }
}
