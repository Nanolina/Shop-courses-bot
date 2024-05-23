import { Controller, Get, Param } from '@nestjs/common';
import { CourseService } from './course.service';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  findAll() {
    return this.courseService.findAll();
  }

  @Get('user/:userId')
  findAllCreatedCoursesByUser(@Param('userId') userId: string) {
    return this.courseService.findAllCreatedCoursesByUser(userId);
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
