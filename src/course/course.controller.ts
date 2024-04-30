import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CourseCreatedDto } from '../dto';
import { imageUploadOptions } from '../utils';
import { CourseService } from './course.service';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createCourseDto: CourseCreatedDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.courseService.create(createCourseDto, image);
  }

  @Get()
  findAll() {
    return this.courseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }
}
