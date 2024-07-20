import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '../logger/logger.module';
import { PrismaService } from '../prisma/prisma.service';
import { UserModule } from '../user/user.module';
import { TextCommandHandler } from './handlers';
import { TelegramBotService } from './telegram-bot.service';
import { TelegramListenersService } from './telegram-listeners.service';
import { TelegramUtilsService } from './telegram-utils.service';

@Module({
  imports: [ConfigModule, LoggerModule, UserModule],
  providers: [
    TelegramBotService,
    TelegramListenersService,
    TelegramUtilsService,
    PrismaService,
    TextCommandHandler,
  ],
  exports: [TelegramBotService, TelegramUtilsService],
})
export class TelegramModule {}
