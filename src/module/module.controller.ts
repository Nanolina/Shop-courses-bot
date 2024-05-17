import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { ModuleService } from './module.service';

@Controller()
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Post('course/:courseId/module')
  create(
    @Param('courseId') courseId: string,
    @Body() createModuleDto: CreateModuleDto,
  ) {
    return this.moduleService.create(courseId, createModuleDto);
  }

  @Get('course/:courseId/module')
  findAll(@Param('courseId') courseId: string) {
    return this.moduleService.findAll(courseId);
  }

  @Get(':moduleId')
  findOne(@Param('moduleId') moduleId: string) {
    return this.moduleService.findOne(moduleId);
  }

  @Patch(':moduleId')
  update(
    @Param('moduleId') moduleId: string,
    @Body() updateModuleDto: UpdateModuleDto,
  ) {
    return this.moduleService.update(moduleId, updateModuleDto);
  }

  @Delete(':moduleId')
  remove(@Param('moduleId') moduleId: string) {
    return this.moduleService.remove(moduleId);
  }
}
