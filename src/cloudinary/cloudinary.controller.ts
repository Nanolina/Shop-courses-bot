import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { LessonService } from '../lesson/lesson.service';
import { MyLogger } from '../logger/my-logger.service';
import { SocketGateway } from '../socket/socket.gateway';
import { TelegramBotService } from '../telegram-bot/telegram-bot.service';

@Controller('api/cloudinary')
export class CloudinaryController {
  constructor(
    private readonly lessonService: LessonService,
    private socketGateway: SocketGateway,
    private readonly logger: MyLogger,
    private readonly telegramBotService: TelegramBotService,
  ) {}

  @Post('webhook')
  async handleWebhook(@Body() data: any, @Res() res: Response) {
    if (!data.context || !data.context.custom) {
      return;
    }

    const userId = Number(data.context.custom.userId);
    const lessonId = data.context.custom.lessonId;
    const chatId = data.context.custom.chatId;
    const url = data.url;
    const publicId = data.public_id;
    try {
      // Remove the video from the cloudinary for replacement
      await this.lessonService.deleteVideoFromCloudinary(lessonId, userId);

      const lesson = await this.lessonService.updateLessonVideo(
        lessonId,
        url,
        publicId,
        userId,
      );

      console.log('cloudinary', lesson);
      this.logger.log({
        method: 'cloudinary-handleWebhook',
        log: 'Lesson is updated with new videoUrl',
      });

      await this.telegramBotService.notifyUserVideoUploaded(
        chatId,
        lesson.name,
      );

      res.status(HttpStatus.OK).send('Webhook processed successfully');
    } catch (error) {
      this.logger.error({ method: 'cloudinary-handleWebhook', error });
      await this.telegramBotService.notifyUserVideoUploaded(
        chatId,
        '',
        error?.message || error,
      );

      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Failed to process webhook');
    }
  }
}
