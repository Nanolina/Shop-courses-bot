import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { COURSE, CREATE, LESSON, MODULE, UPDATE } from '../consts';
import { CourseService } from '../course/course.service';
import { LessonService } from '../lesson/lesson.service';
import { ModuleService } from '../module/module.service';
import { TRY_AGAIN_ERROR } from './consts';
import { TelegramUtilsService } from './telegram-utils.service';

@Injectable()
export class TelegramListenersService {
  constructor(
    private courseService: CourseService,
    private moduleService: ModuleService,
    private lessonService: LessonService,
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
        let data;
        try {
          data = JSON.parse(dataFromWeb);
        } catch (error) {
          await bot.sendMessage(
            chatId,
            TRY_AGAIN_ERROR,
            this.utilsService.getRetryOptions(),
          );
        }

        switch (data.type) {
          case COURSE:
            switch (data.method) {
              // Create course
              case CREATE:
                const createdCourse = await this.courseService.create({
                  ...data,
                  userId,
                });
                if (createdCourse) {
                  await bot.sendMessage(
                    chatId,
                    `🎉 Congrats! Your ${data.name} course is ready! 🌟`,
                  );
                } else {
                  await bot.sendMessage(
                    chatId,
                    TRY_AGAIN_ERROR,
                    this.utilsService.getRetryOptions(),
                  );
                }
                break;
              // Update course
              case UPDATE:
                const updatedCourse = await this.courseService.update({
                  ...data,
                  userId,
                });
                if (updatedCourse) {
                  await bot.sendMessage(
                    chatId,
                    `🎉 Congrats! Your ${data.name} course has been successfully updated! 🌟`,
                  );
                } else {
                  await bot.sendMessage(
                    chatId,
                    TRY_AGAIN_ERROR,
                    this.utilsService.getRetryOptions(),
                  );
                }
                break;
              // If nothing
              default:
                await bot.sendMessage(chatId, 'Okay');
            }
            break;
          case MODULE:
            switch (data.method) {
              // Create module
              case CREATE:
                const createdModule = await this.moduleService.create({
                  ...data,
                  userId,
                });
                if (createdModule) {
                  await bot.sendMessage(
                    chatId,
                    `🎉 Congrats! Your ${data.name} module is ready! 🌟`,
                  );
                } else {
                  await bot.sendMessage(
                    chatId,
                    TRY_AGAIN_ERROR,
                    this.utilsService.getRetryOptions(),
                  );
                }
                break;
              // Update module
              case UPDATE:
                const updatedModule = await this.moduleService.update({
                  ...data,
                  userId,
                });
                if (updatedModule) {
                  await bot.sendMessage(
                    chatId,
                    `🎉 Congrats! Your ${data.name} module has been successfully updated! 🌟`,
                  );
                } else {
                  await bot.sendMessage(
                    chatId,
                    TRY_AGAIN_ERROR,
                    this.utilsService.getRetryOptions(),
                  );
                }
                break;
              // If nothing
              default:
                await bot.sendMessage(chatId, 'Okay');
            }
            break;
          case LESSON:
            switch (data.method) {
              // Create lesson
              case CREATE:
                const createdLesson = await this.lessonService.create({
                  ...data,
                  userId,
                });
                if (createdLesson) {
                  await bot.sendMessage(
                    chatId,
                    `🎉 Congrats! Your ${data.name} lesson is ready! 🌟`,
                  );
                } else {
                  await bot.sendMessage(
                    chatId,
                    TRY_AGAIN_ERROR,
                    this.utilsService.getRetryOptions(),
                  );
                }
                break;
              // Update lesson
              case UPDATE:
                const updatedLesson = await this.lessonService.update({
                  ...data,
                  userId,
                });
                if (updatedLesson) {
                  await bot.sendMessage(
                    chatId,
                    `🎉 Congrats! Your ${data.name} lesson has been successfully updated! 🌟`,
                  );
                } else {
                  await bot.sendMessage(
                    chatId,
                    TRY_AGAIN_ERROR,
                    this.utilsService.getRetryOptions(),
                  );
                }
                break;
              // If nothing
              default:
                await bot.sendMessage(chatId, 'Okay');
            }
            break;
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
