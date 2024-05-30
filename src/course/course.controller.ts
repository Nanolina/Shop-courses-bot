import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { CourseService } from './course.service';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  findAll() {
    return this.courseService.findAll();
  }

  @Get('user')
  @UseGuards(AuthGuard)
  findAllCreatedCoursesByUser(@Req() req: Request) {
    return this.courseService.findAllCreatedCoursesByUser(req.user.id);
  }

  @Get('category/:category')
  findAllCoursesOneCategory(@Param('category') category: string) {
    return this.courseService.findAllCoursesOneCategory(category);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }
}
