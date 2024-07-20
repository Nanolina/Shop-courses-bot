import {
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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Lesson } from '@prisma/client';
import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { TelegramBotService } from '../telegram-bot/telegram-bot.service';
import { UserService } from '../user/user.service';
import { CreateLessonDto, UpdateLessonDto, UpdateVideoUrlDto } from './dto';
import { LessonService } from './lesson.service';
import { FindAllResponse } from './types';

@Controller('lesson')
export class LessonController {
  constructor(
    private readonly lessonService: LessonService,
    private readonly userService: UserService,
    private readonly telegramBotService: TelegramBotService,
  ) {}

  @Get('module/:moduleId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  findAll(
    @Req() req: Request,
    @Param('moduleId') moduleId: string,
  ): Promise<FindAllResponse> {
    return this.lessonService.findAll(moduleId, req.user.id);
  }

  @Post('module/:moduleId')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Req() req: Request,
    @Param('moduleId') moduleId: string,
    @Body() createLessonDto: CreateLessonDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<Lesson> {
    return await this.lessonService.create(
      moduleId,
      req.user.id,
      createLessonDto,
      image,
    );
  }

  @Post(':id/video')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async openBotToSendVideo(
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<void> {
    const userId = req.user.id;
    console.log('userId', userId);
    const { chatId } = await this.userService.getUserData(userId);
    console.log('chatId', chatId);
    const lessonName = await this.lessonService.getLessonName(id, userId);
    console.log('lessonName', lessonName);
    return this.telegramBotService.sendMessageToGetVideo(
      chatId,
      id,
      lessonName,
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  findOne(@Req() req: Request, @Param('id') id: string): Promise<Lesson> {
    return this.lessonService.findOne(id, req.user.id);
  }

  @Patch(':id/video-url')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async updateVideoUrl(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateLessonDto: UpdateVideoUrlDto,
  ): Promise<string> {
    return await this.lessonService.updateVideoUrl(
      id,
      req.user.id,
      updateLessonDto,
    );
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateLessonDto: UpdateLessonDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<Lesson> {
    return await this.lessonService.update(
      id,
      req.user.id,
      updateLessonDto,
      image,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  async delete(@Req() req: Request, @Param('id') id: string): Promise<void> {
    await this.lessonService.delete(id, req.user.id);
  }
}
