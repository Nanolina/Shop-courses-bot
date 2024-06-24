import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { PointsService } from './points.service';

@Controller('points')
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Post('add')
  @UseGuards(AuthGuard)
  async add(
    @Req() req: Request,
    @Body() body: { points: number },
  ): Promise<void> {
    await this.pointsService.add(req.user.id, body.points);
  }

  @Get(':userId')
  @UseGuards(AuthGuard)
  async get(@Req() req: Request): Promise<number> {
    return this.pointsService.get(req.user.id);
  }
}
