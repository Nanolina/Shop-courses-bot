import * as TelegramBot from 'node-telegram-bot-api';
import { UserFromTG } from 'types';

export type HandleTextCommandType = {
  text: string;
  userId: number;
  chatId: number;
  bot: TelegramBot;
  webAppUrl: string;
  language: string;
};

export type HandlePhoneMessageType = {
  phone: string;
  user: UserFromTG;
  chatId: number;
  bot: TelegramBot;
  webAppUrl: string;
  language: string;
};

export type GetPersonalDataEditMessageType = {
  chatId: number;
  bot: TelegramBot;
  webAppUrl: string;
  language: string;
};
