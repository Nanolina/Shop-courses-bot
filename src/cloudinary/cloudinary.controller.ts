import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { StatusEnum } from 'types';
import { LessonService } from '../lesson/lesson.service';
import { MyLogger } from '../logger/my-logger.service';
import { SocketGateway } from '../socket/socket.gateway';

@Controller('api/cloudinary')
export class CloudinaryController {
  constructor(
    private readonly lessonService: LessonService,
    private socketGateway: SocketGateway,
    private readonly logger: MyLogger,
  ) {}

  @Post('webhook')
  async handleWebhook(@Body() data: any, @Res() res: Response) {
    if (!data.context || !data.context.custom) {
      return;
    }

    const userId = Number(data.context.custom.userId);
    const lessonId = data.context.custom.lessonId;
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

      this.logger.log({
        method: 'cloudinary-handleWebhook',
        log: 'Lesson is updated with new videoUrl',
      });

      this.socketGateway.notifyClientVideoUploaded({
        userId,
        status: StatusEnum.Success,
        message: `Your video has been uploaded successfully for lesson ${lesson.name}`,
      });

      res.status(HttpStatus.OK).send('Webhook processed successfully');
    } catch (error) {
      this.logger.error({ method: 'cloudinary-handleWebhook', error });
      this.socketGateway.notifyClientVideoUploaded({
        userId,
        status: StatusEnum.Error,
        message:
          'Unfortunately, it was not possible to upload your video for lesson',
      });

      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Failed to process webhook');
    }
  }
}
