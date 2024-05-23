import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { COURSE, CREATE, DELETE, LESSON, MODULE, UPDATE } from '../consts';
import { CourseService } from '../course/course.service';
import { TRY_AGAIN_ERROR } from './consts';
import {
  CallbackQueryHandler,
  CourseHandlers,
  LessonHandlers,
  ModuleHandlers,
  TextCommandHandler,
} from './handlers';
import { TelegramUtilsService } from './telegram-utils.service';

@Injectable()
export class TelegramListenersService {
  constructor(
    private courseService: CourseService,
    private utilsService: TelegramUtilsService,
    private courseHandlers: CourseHandlers,
    private moduleHandlers: ModuleHandlers,
    private lessonHandlers: LessonHandlers,
    private textCommandHandler: TextCommandHandler,
    private callbackQueryHandler: CallbackQueryHandler,
  ) {}

  async handleCourseData(data, chatId, userId, bot) {
    switch (data.method) {
      case CREATE:
        await this.courseHandlers.handleCreateCourse(chatId, userId, data, bot);
        break;
      case DELETE:
        await this.courseHandlers.handleDeleteCourse(chatId, data, bot);
        break;
      case UPDATE:
        await this.courseHandlers.handleUpdateCourse(chatId, userId, data, bot);
        break;
      default:
        await bot.sendMessage(chatId, 'Okay');
    }
  }

  async handleModuleData(data, chatId, userId, bot) {
    switch (data.method) {
      case CREATE:
        await this.moduleHandlers.handleCreateModule(chatId, userId, data, bot);
        break;
      case UPDATE:
        await this.moduleHandlers.handleUpdateModule(chatId, userId, data, bot);
        break;
      default:
        await bot.sendMessage(chatId, 'Okay');
    }
  }

  async handleLessonData(data, chatId, userId, bot) {
    switch (data.method) {
      case CREATE:
        await this.lessonHandlers.handleCreateLesson(chatId, userId, data, bot);
        break;
      case UPDATE:
        await this.lessonHandlers.handleUpdateLesson(chatId, userId, data, bot);
        break;
      default:
        await bot.sendMessage(chatId, 'Okay');
    }
  }

  setupListeners(bot: TelegramBot) {
    bot.on('message', async (msg) => {
      const { chat, from, text, web_app_data } = msg;
      const chatId = chat.id;
      const userId = from.id;
      console.log('msg', msg);
      const dataFromWeb = web_app_data?.data;
      const webAppUrl = this.utilsService.getWebUrl(userId);

      if (!userId) {
        await bot.sendMessage(
          chatId,
          '❌ Oops! You are unauthorized 😢',
          this.utilsService.getOptions('start', webAppUrl),
        );
      }

      await this.textCommandHandler.handleTextCommand(
        text,
        chatId,
        userId,
        bot,
        webAppUrl,
      );

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
            this.handleCourseData(data, chatId, userId, bot);
            break;
          case MODULE:
            this.handleModuleData(data, chatId, userId, bot);
            break;
          case LESSON:
            this.handleLessonData(data, chatId, userId, bot);
            break;
        }
      }
    });

    bot.on('callback_query', async (callbackQuery) => {
      await this.callbackQueryHandler.handleCallbackQuery(callbackQuery, bot);
    });
  }
}
