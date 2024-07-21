import * as TelegramBot from 'node-telegram-bot-api';
import { UserFromTG } from 'types';

export type HandleTextCommandType = {
  text: string;
  userId: number | bigint;
  chatId: bigint;
  bot: TelegramBot;
  webAppUrl: string;
  language: string;
};

export type HandlePhoneMessageType = {
  phone: string;
  user: UserFromTG;
  chatId: bigint;
  bot: TelegramBot;
  webAppUrl: string;
  language: string;
};

export type GetPersonalDataEditMessageType = {
  chatId: bigint;
  bot: TelegramBot;
  webAppUrl: string;
  language: string;
};
