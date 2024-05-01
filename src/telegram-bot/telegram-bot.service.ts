import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import * as TelegramBot from 'node-telegram-bot-api';
import { TelegramListenersService } from './telegram-listeners.service';

@Injectable()
export class TelegramBotService implements OnModuleInit {
  private bot: TelegramBot;
  private readonly webAppURL: string;

  constructor(
    private configService: ConfigService,
    private listenersService: TelegramListenersService,
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
    this.listenersService.setupListeners(this.bot);
  }
}
