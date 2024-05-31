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
import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { imageUploadOptions } from '../utils';
import { CreateLessonDto, UpdateLessonDto } from './dto';
import { LessonService } from './lesson.service';

@Controller('lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Get('module/:moduleId')
  @UseGuards(AuthGuard)
  findAll(@Req() req: Request, @Param('moduleId') moduleId: string) {
    return this.lessonService.findAll(moduleId, req.user.id);
  }

  @Post('module/:moduleId')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  create(
    @Req() req: Request,
    @Param('moduleId') moduleId: string,
    @Body() createLessonDto: CreateLessonDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.lessonService.create(
      moduleId,
      req.user.id,
      createLessonDto,
      image,
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.lessonService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateLessonDto: UpdateLessonDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.lessonService.update(id, req.user.id, updateLessonDto, image);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  delete(@Req() req: Request, @Param('id') id: string) {
    return this.lessonService.delete(id, req.user.id);
  }
}
