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
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { CreateCourseDto, PurchaseCourseDto, UpdateCourseDto } from './dto';
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
  findAll() {
    return this.courseAllUsersService.findAll();
  }

  // seller
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  create(@Req() req: Request, @Body() createCourseDto: CreateCourseDto) {
    return this.courseSellerService.create(req.user.id, createCourseDto);
  }

  // seller
  @Get('created')
  @UseGuards(AuthGuard)
  findAllCreatedCourses(@Req() req: Request) {
    return this.courseSellerService.findAllCreatedCourses(req.user.id);
  }

  // seller
  @Get('created/:id')
  @UseGuards(AuthGuard)
  findOneCreatedCourse(@Req() req: Request, @Param('id') id: string) {
    return this.courseSellerService.findOneCreatedCourse(id, req.user.id);
  }

  // customer
  @Get('purchased')
  @UseGuards(AuthGuard)
  findAllPurchasedCourses(@Req() req: Request) {
    return this.courseCustomerService.findAllPurchasedCourses(req.user.id);
  }

  // customer
  @Get('purchased/:id')
  @UseGuards(AuthGuard)
  findOnePurchasedCourse(@Req() req: Request, @Param('id') id: string) {
    return this.courseCustomerService.findOnePurchasedCourse(id, req.user.id);
  }

  // customer
  @Post(':id/purchase')
  @UseGuards(AuthGuard)
  purchase(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() purchaseCourseDto: PurchaseCourseDto,
  ) {
    return this.courseCustomerService.purchase(
      id,
      req.user.id,
      purchaseCourseDto,
    );
  }

  // all users
  @Get('category/:category')
  findAllCoursesOneCategory(@Param('category') category: string) {
    return this.courseAllUsersService.findAllCoursesOneCategory(category);
  }

  // all users
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseAllUsersService.findOne(id);
  }

  // seller
  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.courseSellerService.update(id, req.user.id, updateCourseDto);
  }

  // seller
  @Delete(':id')
  @UseGuards(AuthGuard)
  delete(@Req() req: Request, @Param('id') id: string) {
    return this.courseSellerService.delete(id, req.user.id);
  }
}
