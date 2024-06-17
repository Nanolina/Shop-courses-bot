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
import { CreateCourseDto, UpdateCourseDto } from './dto';
import {
  CourseAllUsersService,
  CourseCustomerService,
  CourseSellerService,
} from './services';

@Controller('course')
export class CourseController {
  constructor(
    private readonly courseAllUsersService: CourseAllUsersService,
    private readonly courseCustomerService: CourseCustomerService,
    private readonly courseSellerService: CourseSellerService,
  ) {}

  // all users
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
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
  ) {
    return this.courseSellerService.create(req.user.id, createCourseDto, image);
  }

  // seller
  @Get('created')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  findAllCreatedCourses(@Req() req: Request) {
    return this.courseSellerService.findAllCreatedCourses(req.user.id);
  }

  // seller
  @Get('created/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  findOneCreatedCourse(@Req() req: Request, @Param('id') id: string) {
    return this.courseSellerService.findOneCreatedCourse(id, req.user.id);
  }

  // customer
  @Get('purchased')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  findAllPurchasedCourses(@Req() req: Request) {
    return this.courseCustomerService.findAllPurchasedCourses(req.user.id);
  }

  // customer
  @Get('purchased/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  findOnePurchasedCourse(@Req() req: Request, @Param('id') id: string) {
    return this.courseCustomerService.findOnePurchasedCourse(id, req.user.id);
  }

  // customer
  @Post(':id/purchase')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  purchase(@Req() req: Request, @Param('id') id: string) {
    return this.courseCustomerService.purchase(id, req.user.id);
  }

  // all users
  @Get('category/:category')
  @HttpCode(HttpStatus.OK)
  findAllCoursesOneCategory(@Param('category') category: string) {
    return this.courseAllUsersService.findAllCoursesOneCategory(category);
  }

  // all users
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  findOne(@Req() req: Request, @Param('id') id: string) {
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
  ) {
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
  async delete(@Req() req: Request, @Param('id') id: string) {
    await this.courseSellerService.delete(id, req.user.id);
  }
}
