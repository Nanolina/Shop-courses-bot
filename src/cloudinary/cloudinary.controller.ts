import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { LessonService } from '../lesson/lesson.service';
import { MyLogger } from '../logger/my-logger.service';

@Controller('api/cloudinary')
export class CloudinaryController {
  constructor(
    private readonly lessonService: LessonService,
    private readonly logger: MyLogger,
  ) {}

  @Post('webhook')
  async handleWebhook(@Body() data: any, @Res() res: Response) {
    try {
      const lessonId = data.context.custom.lessonId;
      const userId = Number(data.context.custom.userId);
      const url = data.url;
      const publicId = data.public_id;

      // Remove the video from the cloudinary for replacement
      await this.lessonService.deleteVideoFromCloudinary(lessonId, userId);

      await this.lessonService.updateLessonVideo(
        lessonId,
        url,
        publicId,
        userId,
      );
      res.status(HttpStatus.OK).send('Webhook processed successfully');
    } catch (error) {
      this.logger.error({ method: 'handleWebhook', error });
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Failed to process webhook');
    }
  }
}
