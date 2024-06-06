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
import { CreateModuleDto, UpdateModuleDto } from './dto';
import { ModuleService } from './module.service';

@Controller('module')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Get('course/:courseId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  findAll(@Req() req: Request, @Param('courseId') courseId: string) {
    return this.moduleService.findAll(courseId, req.user.id);
  }

  @Post('course/:courseId')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Req() req: Request,
    @Param('courseId') courseId: string,
    @Body() createModuleDto: CreateModuleDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.moduleService.create(
      courseId,
      req.user.id,
      createModuleDto,
      image,
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.moduleService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateModuleDto: UpdateModuleDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.moduleService.update(id, req.user.id, updateModuleDto, image);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  async delete(@Req() req: Request, @Param('id') id: string) {
    await this.moduleService.delete(id, req.user.id);
  }
}
