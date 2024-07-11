import { CacheInterceptor } from '@nestjs/cache-manager';
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
import { Course } from '@prisma/client';
import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { CreateCourseDto, UpdateCourseDto } from './dto';
import {
  CourseAllUsersService,
  CourseCustomerService,
  CourseSellerService,
} from './services';
import { FindOneResponse } from './types';

@Controller('course')
export class CourseController {
  constructor(
    private readonly courseAllUsersService: CourseAllUsersService,
    private readonly courseCustomerService: CourseCustomerService,
    private readonly courseSellerService: CourseSellerService,
  ) {}

  // all users
  @Get()
  @UseInterceptors(CacheInterceptor)
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<Course[]> {
    return this.courseAllUsersService.findAll();
  }

  // seller
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Req() req: Request,
    @Body() createCourseDto: CreateCourseDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<Course> {
    return this.courseSellerService.create(req.user.id, createCourseDto, image);
  }

  // seller
  @Get('created')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  findAllCreatedCourses(@Req() req: Request): Promise<Course[]> {
    return this.courseSellerService.findAllCreatedCourses(req.user.id);
  }

  // customer
  @Get('purchased')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  findAllPurchasedCourses(@Req() req: Request): Promise<Course[]> {
    return this.courseCustomerService.findAllPurchasedCourses(req.user.id);
  }

  // all users
  @Get('category/:category')
  @UseInterceptors(CacheInterceptor)
  @HttpCode(HttpStatus.OK)
  findAllCoursesOneCategory(
    @Param('category') category: string,
  ): Promise<Course[]> {
    return this.courseAllUsersService.findAllCoursesOneCategory(category);
  }

  // all users
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  findOne(
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<FindOneResponse> {
    return this.courseAllUsersService.findOne(id, req.user.id);
  }

  // seller
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<Course> {
    return this.courseSellerService.update(
      id,
      req.user.id,
      updateCourseDto,
      image,
    );
  }

  // seller
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  async delete(@Req() req: Request, @Param('id') id: string): Promise<void> {
    await this.courseSellerService.delete(id, req.user.id);
  }
}
