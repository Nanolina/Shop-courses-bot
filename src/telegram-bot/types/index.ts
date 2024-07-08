import * as TelegramBot from 'node-telegram-bot-api';

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
  userId: number;
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
