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
    @InjectRedis() private readonly redisClient: Redis,
  ) {}

  onModuleInit() {
    const token = this.configService.get<string>('BOT_TOKEN');
    if (!token) {
      throw new Error('BOT_TOKEN is not defined in the env');
    }

    this.bot = new TelegramBot(token, { polling: true });
    this.listenersService.setupListeners(this.bot);
  }
}
