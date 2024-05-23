import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { CourseService } from '../../course/course.service';
import { TRY_AGAIN_ERROR } from '../consts';
import { TelegramUtilsService } from '../telegram-utils.service';

@Injectable()
export class CourseHandlers {
  constructor(
    private courseService: CourseService,
    private utilsService: TelegramUtilsService,
  ) {}

  async handleCreateCourse(
    chatId: number,
    userId: number,
    data: any,
    bot: TelegramBot,
  ) {
    const createdCourse = await this.courseService.create({
      ...data,
      userId,
    });
    if (createdCourse) {
      await bot.sendMessage(
        chatId,
        `🎉 Fantastic! Your course "${data.name}" is now ready and live! 🌟 Feel free to dive in and start sharing your knowledge. Exciting times ahead!`,
      );
    } else {
      await bot.sendMessage(
        chatId,
        TRY_AGAIN_ERROR,
        this.utilsService.getRetryOptions(),
      );
    }
  }

  async handleDeleteCourse(chatId: number, data: any, bot: TelegramBot) {
    const course = await this.courseService.findWithCount(data.id);
    const modulesCount = course._count.modules > 0 ? course._count.modules : '';
    const modulesPlural = course._count.modules > 1 ? 'modules' : 'module';
    await bot.sendMessage(
      chatId,
      `🔴 Attention! Are you sure you want to delete the course "${course.name}"? ${modulesCount ? `This course contains ${modulesCount} ${modulesPlural}, and all associated modules and lessons will also be permanently deleted.` : ''} This action cannot be undone. Please confirm your decision. 🗑️`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'YES',
                callback_data: `course delete ${data.id}`,
              },
            ],
            [{ text: 'NO', callback_data: '/mycreatedcourses' }],
          ],
        },
      },
    );
  }

  async handleUpdateCourse(
    chatId: number,
    userId: number,
    data: any,
    bot: TelegramBot,
  ) {
    const updatedCourse = await this.courseService.update({
      ...data,
      userId,
    });
    if (updatedCourse) {
      await bot.sendMessage(
        chatId,
        `🌟 Awesome news! Your course titled "${data.name}" has been updated successfully! Keep up the great work! 🎉`,
      );
    } else {
      await bot.sendMessage(
        chatId,
        TRY_AGAIN_ERROR,
        this.utilsService.getRetryOptions(),
      );
    }
  }
}
