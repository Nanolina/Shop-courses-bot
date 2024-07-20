import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import * as TelegramBot from 'node-telegram-bot-api';
import { TelegramListenersService } from './telegram-listeners.service';

@Injectable()
export class TelegramBotService implements OnModuleInit {
  private bot: TelegramBot;

  constructor(
    private configService: ConfigService,
    private listenersService: TelegramListenersService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  onModuleInit() {
    const token = this.configService.get<string>('BOT_TOKEN');
    if (!token) {
      throw new Error('BOT_TOKEN is not defined in the env');
    }

    this.bot = new TelegramBot(token, { polling: true });
    this.listenersService.setupListeners(this.bot);
  }

  async notifyUserVideoUploaded(
    chatId: number,
    lessonName: string,
    error?: string,
  ) {
    console.log('notifyUserVideoUploaded-chatId', chatId);
    console.log('notifyUserVideoUploaded-lessonName', lessonName);
    await this.bot.sendMessage(
      chatId,
      !error
        ? `Ваше видео для урока "${lessonName}" успешно загружено!`
        : 'Something went wrong with uploading video',
    );
  }

  async sendMessageToGetVideo(
    chatId: bigint,
    lessonId: string,
    lessonName: string,
  ) {
    // Save lessonId by chatId in the Redis
    await this.redis.set(`chatId:${chatId}`, lessonId);

    await this.bot.sendMessage(
      chatId,
      `Отправьте видео для урока ${lessonName}`,
      { parse_mode: 'Markdown' },
    );
  }
}
