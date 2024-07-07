import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { TonMonitorService } from './ton-monitor.service';

@Controller('ton')
export class TonController {
  constructor(private readonly tonMonitorService: TonMonitorService) {}

  @Post('monitor')
  @UseGuards(AuthGuard)
  async monitorContract(
    @Req() req: Request,
    @Body()
    monitorData: {
      contractAddress: string;
      initialBalance: string;
      courseId: string;
      type: 'create' | 'purchase';
      language: 'en' | 'ru';
    },
  ) {
    const { contractAddress, initialBalance, courseId, type, language } =
      monitorData;
    try {
      await this.tonMonitorService.monitorContract(
        req.user.id,
        contractAddress,
        initialBalance,
        courseId,
        type,
        language,
      );
    } catch (error) {
      console.error('error', error?.message);
    }
    return { message: 'Monitoring started' };
  }
}
