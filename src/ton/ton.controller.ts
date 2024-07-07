import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { MyLogger } from '../logger/my-logger.service';
import { MonitorContractDto } from './dto';
import { TonMonitorService } from './ton-monitor.service';

@Controller('ton')
export class TonController {
  constructor(
    private readonly tonMonitorService: TonMonitorService,
    private readonly logger: MyLogger,
  ) {}

  @Post('monitor')
  @UseGuards(AuthGuard)
  async monitorContract(
    @Req() req: Request,
    @Body()
    monitorData: MonitorContractDto,
  ) {
    try {
      await this.tonMonitorService.monitorContract(req.user.id, monitorData);
    } catch (error) {
      this.logger.error({
        method: 'ton-monitorContract',
        error: error?.message,
      });
    }
    return { message: 'Monitoring started' };
  }
}
