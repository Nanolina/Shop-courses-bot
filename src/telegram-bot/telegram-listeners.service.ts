import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import * as TelegramBot from 'node-telegram-bot-api';
import { CourseService } from '../course/course.service';
import { ImageService } from '../image/image.service';
import { TRY_AGAIN_ERROR } from './consts';
import { TelegramUtilsService } from './telegram-utils.service';

@Injectable()
export class TelegramListenersService {
  private lastPhotoTime: Record<number, number> = {}; // Tracks last photo processing time per chat

  constructor(
    private courseService: CourseService,
    private imageService: ImageService,
    private utilsService: TelegramUtilsService,
    private redisClient: Redis,
  ) {}

  setupListeners(bot: TelegramBot) {
    bot.on('message', async (msg) => {
      const { chat, from, photo, text, web_app_data } = msg;
      const chatId = chat.id;
      const userId = from.id;
      const userName = from.username;
      const dataFromWeb = web_app_data?.data;
      const currentTime = Date.now();

      if (!userId) {
        await bot.sendMessage(
          chatId,
          '❌ Oops! You are unauthorized 😢',
          this.utilsService.getOptions('start'),
        );
      }

      if (
        photo &&
        (!this.lastPhotoTime[chatId] ||
          currentTime - this.lastPhotoTime[chatId] > 3000)
      ) {
        // 3000 milliseconds threshold
        this.lastPhotoTime[chatId] = currentTime; // Update last photo time
        const largestPhoto = photo.sort((a, b) => b.file_size - a.file_size)[0];
        const courseId = await this.redisClient.get(`courseId:${chatId}`);
        if (courseId) {
          // Get a reference to the file
          const fileId = largestPhoto.file_id;
          const temporaryImageUrl = await bot.getFileLink(fileId);

          // Send a message about the start of loading
          const message = await bot.sendMessage(
            chatId,
            '⏳ Uploading your image, please wait... 🖼️',
          );

          try {
            await this.imageService.upload(temporaryImageUrl, courseId, userId);

            // Update the message after loading
            await bot.editMessageText(
              '✅ Image uploaded successfully! Let’s start creating the first module! 🚀',
              { chat_id: chatId, message_id: message.message_id },
            );

            // Clicking the button to see created courses
            await bot.sendMessage(
              chatId,
              '📚 To manage your courses or modules, press the button below! 🔧',
              this.utilsService.getOptions('mycreatedcourses'),
            );
          } catch (error) {
            await bot.editMessageText(TRY_AGAIN_ERROR, {
              chat_id: chatId,
              message_id: message.message_id,
            });
          }
        }

        // Finish processing the message if it is a photo
        return;
      }

      switch (text) {
        case '/create':
          await bot.sendMessage(
            chatId,
            '✍️ Ready to create your own online course? Click below! 📝',
            this.utilsService.getOptions('create'),
          );
          break;
        case '/mycreatedcourses':
          await bot.sendMessage(
            chatId,
            '✍️ Want to add or change modules in the course? Click below! 📝',
            this.utilsService.getOptions('mycreatedcourses'),
          );
          break;
        case '/start':
          await bot.sendMessage(
            chatId,
            '🛒 Looking to buy an online course? Start here! 🎓',
            this.utilsService.getOptions('start'),
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
            userName,
          });
          if (course) {
            await this.redisClient.set(`courseId:${chatId}`, course.id);
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
      if (data === '/create') {
        await bot.sendMessage(
          chatId,
          '📝 Let’s start creating your new course! 🎨',
          this.utilsService.getOptions('create'),
        );
      }
    });
  }
}
