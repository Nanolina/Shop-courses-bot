import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import * as TelegramBot from 'node-telegram-bot-api';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { TextCommandHandler } from './handlers';
import { TelegramUtilsService } from './telegram-utils.service';

@Injectable()
export class TelegramListenersService {
  constructor(
    private utilsService: TelegramUtilsService,
    private textCommandHandler: TextCommandHandler,
    private cloudinaryService: CloudinaryService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  setupListeners(bot: TelegramBot) {
    bot.on('message', async (msg) => {
      const { chat, from, text } = msg;
      console.log('msg', msg);
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

    bot.on('video', async (msg) => {
      const { chat, from, video } = msg;
      console.log('video', msg);
      const chatId = chat.id;
      const userId = from.id;
      const fileId = video.file_id;

      // Get lessonId by chatId from Redis
      const lessonId = await this.redis.get(`chatId:${chatId}`);
      const file = await bot.getFile(fileId);
      const fileUrl = `https://api.telegram.org/file/bot${bot.token}/${file.file_path}`;
      console.log('fileUrl', fileUrl);

      try {
        await this.cloudinaryService.uploadVideoFromUrl(
          fileUrl,
          lessonId,
          userId,
          chatId,
        );
        await bot.sendMessage(
          chatId,
          'Ваше видео загружается. Вы получите уведомление об успешной загрузке',
        );
      } catch (error) {
        console.error('Error uploading video to Cloudinary:', error);
        await bot.sendMessage(
          chatId,
          'Произошла ошибка при загрузке вашего видео. Пожалуйста, попробуйте еще раз.',
        );
      }
    });
  }
}
