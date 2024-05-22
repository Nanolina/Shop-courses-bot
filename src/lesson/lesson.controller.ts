import { Controller, Get, Param } from '@nestjs/common';
import { LessonService } from './lesson.service';

@Controller()
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Get('module/:moduleId/lesson')
  findAll(@Param('moduleId') moduleId: string) {
    return this.lessonService.findAll(moduleId);
  }

  @Get('lesson/:lessonId')
  findOne(@Param('lessonId') lessonId: string) {
    return this.lessonService.findOne(lessonId);
  }
}
