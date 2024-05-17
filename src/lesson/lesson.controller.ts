import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { LessonService } from './lesson.service';

@Controller()
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post('module/:moduleId/lesson')
  create(
    @Param('moduleId') moduleId: string,
    @Body() createLessonDto: CreateLessonDto,
  ) {
    return this.lessonService.create(moduleId, createLessonDto);
  }

  @Get('module/:moduleId/lesson')
  findAll(@Param('moduleId') moduleId: string) {
    return this.lessonService.findAll(moduleId);
  }

  @Get(':lessonId')
  findOne(@Param('lessonId') lessonId: string) {
    return this.lessonService.findOne(lessonId);
  }

  @Patch(':lessonId')
  update(
    @Param('lessonId') lessonId: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    return this.lessonService.update(lessonId, updateLessonDto);
  }

  @Delete(':lessonId')
  remove(@Param('lessonId') lessonId: string) {
    return this.lessonService.remove(lessonId);
  }
}
