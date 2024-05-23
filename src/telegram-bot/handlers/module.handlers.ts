import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { ModuleService } from '../../module/module.service';
import { TRY_AGAIN_ERROR } from '../consts';
import { TelegramUtilsService } from '../telegram-utils.service';

@Injectable()
export class ModuleHandlers {
  constructor(
    private moduleService: ModuleService,
    private utilsService: TelegramUtilsService,
  ) {}

  async handleCreateModule(
    chatId: number,
    userId: number,
    data: any,
    bot: TelegramBot,
  ) {
    const createdModule = await this.moduleService.create({
      ...data,
      userId,
      courseId: data.parentId,
    });
    if (createdModule) {
      await bot.sendMessage(
        chatId,
        `🌟 Wonderful! Your new module "${data.name}" is ready! It's time to fill it with exciting lessons and share your knowledge! 📘`,
      );
    } else {
      await bot.sendMessage(
        chatId,
        TRY_AGAIN_ERROR,
        this.utilsService.getRetryOptions(),
      );
    }
  }

  async handleUpdateModule(
    chatId: number,
    userId: number,
    data: any,
    bot: TelegramBot,
  ) {
    const updatedModule = await this.moduleService.update({
      ...data,
      userId,
      courseId: data.parentId,
    });
    if (updatedModule) {
      await bot.sendMessage(
        chatId,
        `🌟 Excellent! Your module "${data.name}" has been updated successfully. Take a moment to review the enhancements and continue building great content! 🛠️`,
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
