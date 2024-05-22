import { Controller, Get, Param } from '@nestjs/common';
import { ModuleService } from './module.service';

@Controller()
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Get('course/:courseId/module')
  findAll(@Param('courseId') courseId: string) {
    return this.moduleService.findAll(courseId);
  }

  @Get('module/:moduleId')
  findOne(@Param('moduleId') moduleId: string) {
    return this.moduleService.findOne(moduleId);
  }
}
