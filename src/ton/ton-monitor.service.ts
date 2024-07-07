import { Injectable } from '@nestjs/common';
import { fromNano } from 'ton';
import { DeployEnum, DeployType, LanguageType, StatusEnum } from 'types';
import { CourseCustomerService } from '../course/services';
import { PointsService } from '../points/points.service';
import { SocketGateway } from '../socket/socket.gateway';
import { TelegramUtilsService } from '../telegram-bot/telegram-utils.service';
import { TonService } from './ton.service';

const maxAttempts = 15; // 15 attempts every 20 seconds for 5 min

@Injectable()
export class TonMonitorService {
  constructor(
    private tonService: TonService,
    private socketGateway: SocketGateway,
    private pointsService: PointsService,
    private utilsService: TelegramUtilsService,
    private readonly courseCustomerService: CourseCustomerService,
  ) {}

  async monitorContract(
    userId: number,
    contractAddress: string,
    initialBalance: string,
    courseId: string,
    type: DeployType,
    language: LanguageType,
  ) {
    let attempts = 0;
    const initialBalanceNumber = parseFloat(initialBalance);
    const interval = setInterval(async () => {
      if (++attempts > maxAttempts) {
        this.sendStatus(userId, type, language, StatusEnum.Error);
        return clearInterval(interval);
      }

      try {
        const newBalanceNumber = parseFloat(
          fromNano(await this.tonService.getAccountBalance(contractAddress)),
        );
        if (newBalanceNumber > initialBalanceNumber) {
          await this.handleBalanceIncrease(
            userId,
            courseId,
            type,
            language,
            newBalanceNumber,
          );
          clearInterval(interval);
        }
      } catch (error) {
        console.error('Error during balance check:', error);
        this.sendStatus(userId, type, language, StatusEnum.Error);
        clearInterval(interval);
      }
    }, 20000); // Check every 20 seconds
  }

  private async handleBalanceIncrease(
    userId: number,
    courseId: string,
    type: DeployType,
    language: LanguageType,
    balance: number,
  ) {
    try {
      let points;
      if (type === DeployEnum.Purchase) {
        await this.courseCustomerService.purchase(courseId, userId);
        points = await this.pointsService.addPointsForCoursePurchase(userId);
      } else {
        points = await this.pointsService.addPointsForCourseCreation(
          courseId,
          userId,
        );
      }

      this.socketGateway.notifyClientContractUpdated({
        userId,
        points,
        balance,
        status: StatusEnum.Success,
        type,
        message: this.utilsService.getTranslatedMessage(
          language,
          `${type.toLowerCase()}_success`,
          '',
          '🏆',
        ),
      });
    } catch (error) {
      console.error('Error during course action:', error);
      this.sendStatus(userId, type, language, StatusEnum.Error);
    }
  }

  private sendStatus(
    userId: number,
    type: DeployType,
    language: LanguageType,
    status: StatusEnum,
  ) {
    this.socketGateway.notifyClientContractUpdated({
      userId,
      status,
      type,
      message: this.utilsService.getTranslatedMessage(
        language,
        `${type.toLowerCase()}_${status === StatusEnum.Success ? StatusEnum.Success : StatusEnum.Error}`,
        '',
        '🔄',
      ),
    });
  }
}
