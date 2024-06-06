import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { CreateLessonDto, UpdateLessonDto } from './dto';
import { LessonService } from './lesson.service';

@Controller('lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Get('module/:moduleId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  findAll(@Req() req: Request, @Param('moduleId') moduleId: string) {
    return this.lessonService.findAll(moduleId, req.user.id);
  }

  @Post('module/:moduleId')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('files', 2))
  async create(
    @Req() req: Request,
    @Param('moduleId') moduleId: string,
    @Body() createLessonDto: CreateLessonDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const image = files.find((file) => file.mimetype.startsWith('image/'));
    const video = files.find((file) => file.mimetype.startsWith('video/'));

    if (!(video || createLessonDto.videoUrl)) {
      throw new BadRequestException(
        'You should submit a video or link to a video to create a lesson',
      );
    }

    // Creating a lesson without video URL and public ID
    const lesson = await this.lessonService.create(
      moduleId,
      req.user.id,
      createLessonDto,
      image,
    );

    // Asynchronous loading of video
    if (video && !createLessonDto.videoUrl) {
      this.lessonService.uploadVideoAndUpdateLesson(
        video,
        lesson.id,
        req.user.id,
      );
    }

    return lesson;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.lessonService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('files', 2))
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateLessonDto: UpdateLessonDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    let image;
    let video;
    if (files && files.length) {
      image = files.find((file) => file.mimetype.startsWith('image/'));
      video = files.find((file) => file.mimetype.startsWith('video/'));
    }

    // Creating a lesson without video URL and public ID
    const lesson = await this.lessonService.update(
      id,
      req.user.id,
      updateLessonDto,
      image,
    );

    // Asynchronous loading of video
    if (video && !updateLessonDto.videoUrl) {
      this.lessonService.uploadVideoAndUpdateLesson(video, id, req.user.id);
    }

    return lesson;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  async delete(@Req() req: Request, @Param('id') id: string) {
    await this.lessonService.delete(id, req.user.id);
  }
}
