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
    const interval = setInterval(async () => {
      attempts++;
      console.log('attempts', attempts);
      try {
        const newBalance =
          await this.tonService.getAccountBalance(contractAddress);
        const newBalanceNumber = parseFloat(fromNano(newBalance));
        const initialBalanceNumber = parseFloat(initialBalance);

        console.log('newBalanceNumber', newBalanceNumber);
        console.log('initialBalanceNumber', initialBalanceNumber);
        if (
          newBalanceNumber > initialBalanceNumber ||
          attempts >= maxAttempts
        ) {
          clearInterval(interval);
          if (newBalanceNumber > initialBalanceNumber) {
            if (type === DeployEnum.Create) {
              const points =
                await this.pointsService.addPointsForCourseCreation(
                  courseId,
                  userId,
                );
              this.socketGateway.notifyClientContractUpdated({
                userId,
                points,
                status: StatusEnum.Success,
                type: DeployEnum.Create,
                balance: newBalanceNumber,
                message: this.utilsService.getTranslatedMessage(
                  language,
                  'course_activated_success',
                  '',
                  '🏆',
                ),
              });

              // type === 'Purchase'
            } else {
              try {
                await this.courseCustomerService.purchase(courseId, userId);

                const points =
                  await this.pointsService.addPointsForCoursePurchase(userId);
                this.socketGateway.notifyClientContractUpdated({
                  userId,
                  points,
                  status: StatusEnum.Success,
                  type: DeployEnum.Purchase,
                  balance: newBalanceNumber,
                  message: this.utilsService.getTranslatedMessage(
                    language,
                    'course_purchased_success',
                    '',
                    '🏆',
                  ),
                });
              } catch (error) {
                console.error('error', error);
                this.socketGateway.notifyClientContractUpdated({
                  userId,
                  status: StatusEnum.Error,
                  type: DeployEnum.Purchase,
                  message: this.utilsService.getTranslatedMessage(
                    language,
                    'course_purchased_error',
                    '',
                    '🔄',
                  ),
                });
              }
            }
          } else {
            if (type === DeployEnum.Create) {
              this.socketGateway.notifyClientContractUpdated({
                userId,
                status: StatusEnum.Error,
                type: DeployEnum.Create,
                message: this.utilsService.getTranslatedMessage(
                  language,
                  'course_activated_error',
                  '',
                  '🔄',
                ),
              });
            } else {
              this.socketGateway.notifyClientContractUpdated({
                userId,
                status: StatusEnum.Error,
                type: DeployEnum.Purchase,
                message: this.utilsService.getTranslatedMessage(
                  language,
                  'course_purchased_error',
                  '',
                  '🔄',
                ),
              });
            }
          }
        }
      } catch (error) {
        console.error('error', error);
        this.socketGateway.notifyClientContractUpdated({
          userId,
          status: StatusEnum.Error,
          message: this.utilsService.getTranslatedMessage(
            language,
            'something_went_wrong',
            '',
            '🔄',
          ),
        });
        clearInterval(interval); // Stop the interval for any error
      }
    }, 20000); // Check every 20 seconds
  }
}
