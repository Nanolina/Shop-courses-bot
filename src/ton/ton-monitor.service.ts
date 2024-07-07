import { Injectable } from '@nestjs/common';
import { fromNano } from 'ton';
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
  ) {}

  async monitorContract(
    userId: number,
    contractAddress: string,
    initialBalance: string,
    courseId: string,
    type: 'create' | 'purchase',
    language: 'en' | 'ru',
  ) {
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      try {
        const newBalance =
          await this.tonService.getAccountBalance(contractAddress);
        const newBalanceInTon = fromNano(newBalance);

        if (
          parseFloat(newBalanceInTon) > parseFloat(initialBalance) ||
          attempts >= maxAttempts
        ) {
          clearInterval(interval);
          if (parseFloat(newBalanceInTon) > parseFloat(initialBalance)) {
            if (type === 'create') {
              await this.pointsService.addPointsForCourseCreation(
                courseId,
                userId,
              );
              this.socketGateway.notifyClient(
                'success',
                userId,
                this.utilsService.getTranslatedMessage(
                  language,
                  'course_activated_success',
                  '🎊 ✅',
                  '🎉 🏆',
                ),
              );
            } else if (type === 'purchase') {
              await this.pointsService.addPointsForCoursePurchase(userId);
              this.socketGateway.notifyClient(
                'success',
                userId,
                this.utilsService.getTranslatedMessage(
                  language,
                  'course_purchased_success',
                  '🎊 ✅',
                  '🎉 🏆',
                ),
              );
            }
          } else {
            console.log('Nothing changed');
            if (type === 'create') {
              this.socketGateway.notifyClient(
                'error',
                userId,
                this.utilsService.getTranslatedMessage(
                  language,
                  'course_activated_error',
                  '😔 ❌',
                  '🔄',
                ),
              );
            } else if (type === 'purchase') {
              this.socketGateway.notifyClient(
                'error',
                userId,
                this.utilsService.getTranslatedMessage(
                  language,
                  'course_purchased_error',
                  '😔 ❌',
                  '🔄',
                ),
              );
            }
          }
        }
      } catch (error) {
        this.socketGateway.notifyClient(
          'error',
          userId,
          this.utilsService.getTranslatedMessage(
            language,
            'something_went_wrong',
            '😔 ❌',
            '🔄',
          ),
        );
        clearInterval(interval); // Stop the interval for any error
      }
      console.log('Attempts', attempts);
    }, 20000); // Check every 20 seconds
  }
}
