import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { fromNano } from 'ton';
import { DeployEnum, DeployType, LanguageType, StatusEnum } from 'types';
import { v4 as uuidv4 } from 'uuid';
import { CourseCustomerService } from '../course/services';
import { MyLogger } from '../logger/my-logger.service';
import { PointsService } from '../points/points.service';
import { SocketGateway } from '../socket/socket.gateway';
import { TelegramUtilsService } from '../telegram-bot/telegram-utils.service';
import { MonitorContractDto } from './dto';
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
    private readonly logger: MyLogger,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async monitorContract(userId: number, dto: MonitorContractDto) {
    const {
      contractAddress,
      initialBalance,
      courseId,
      type,
      language = 'en',
    } = dto;

    const sessionKeyBase = `monitor:${contractAddress}:${initialBalance}`;
    const newSessionId = uuidv4();
    const newSessionKey = `${sessionKeyBase}:${newSessionId}`;

    const existingSessionKeys = await this.redis.keys(`${sessionKeyBase}:*`);

    // Terminate all existing sessions
    for (const key of existingSessionKeys) {
      const existingSessionId = await this.redis.get(key);
      if (existingSessionId) {
        clearInterval(parseInt(existingSessionId));
        await this.redis.del(key);
      }
    }

    let attempts = 0;
    const interval = setInterval(async () => {
      if (++attempts > maxAttempts) {
        this.sendErrorNotification(userId, type, language);
        clearInterval(interval);
        await this.redis.del(newSessionKey);
      }

      try {
        const newBalanceNumber = parseFloat(
          fromNano(await this.tonService.getAccountBalance(contractAddress)),
        );

        if (newBalanceNumber > initialBalance) {
          await this.handleBalanceIncrease(
            userId,
            courseId,
            type,
            language,
            newBalanceNumber,
          );
          clearInterval(interval);
          await this.redis.del(newSessionKey);
        }
      } catch (error) {
        this.logger.error({
          method: 'ton-monitor-monitorContract',
          error: error?.message,
        });
        this.sendErrorNotification(userId, type, language);
        clearInterval(interval);
        await this.redis.del(newSessionKey);
      }
    }, 20000); // Check every 20 seconds

    // Save the interval ID in Redis
    await this.redis.set(newSessionKey, interval[Symbol.toPrimitive]());
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
          `course_${type}_success`,
          '',
          '🏆',
        ),
      });
    } catch (error) {
      this.logger.error({
        method: 'ton-monitor-handleBalanceIncrease',
        error: error?.message,
      });
      this.sendErrorNotification(userId, type, language);
    }
  }

  private sendErrorNotification(
    userId: number,
    type: DeployType,
    language: LanguageType,
  ) {
    this.socketGateway.notifyClientContractUpdated({
      userId,
      type,
      status: StatusEnum.Error,
      message: this.utilsService.getTranslatedMessage(
        language,
        `course_${type}_error`,
        '',
        '🔄',
      ),
    });
  }
}
