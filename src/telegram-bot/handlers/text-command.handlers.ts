import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { TelegramUtilsService } from '../telegram-utils.service';
import { HandlePhoneMessageType, HandleTextCommandType } from '../types';

@Injectable()
export class TextCommandHandler {
  constructor(
    private utilsService: TelegramUtilsService,
    private userService: UserService,
  ) {}

  async handleTextCommand(dto: HandleTextCommandType) {
    const { text, userId, chatId, bot, webAppUrl, language } = dto;
    let message;
    switch (text) {
      // Create
      case '/create':
        // Check if the user has a phone number in the database
        const { phone, email, isVerifiedEmail } =
          await this.userService.getUserData(userId);

        // If no phone
        if (!phone) {
          message = this.utilsService.getTranslatedMessage(
            language,
            'phone_required',
            '📱',
          );
          await bot.sendMessage(
            chatId,
            message,
            this.utilsService.getPhoneRequestOptions(language),
          );
          break;

          // If no email
        } else if (!email || !isVerifiedEmail) {
          // Send a message to a user after saving a phone number
          message = this.utilsService.getTranslatedMessage(
            language,
            'email_required',
            '✉️',
            '👇',
          );
          await bot.sendMessage(
            chatId,
            message,
            this.utilsService.getOptions('personaldata', webAppUrl, language),
          );
          break;

          // Create
        } else {
          message = this.utilsService.getTranslatedMessage(
            language,
            'create',
            '🌱',
            '📝',
          );
          await bot.sendMessage(
            chatId,
            message,
            this.utilsService.getOptions('create', webAppUrl, language),
          );
        }
        break;

      // Created courses
      case '/createdcourses':
        message = this.utilsService.getTranslatedMessage(
          language,
          'created_courses',
          '🔧',
          '✍️',
        );
        await bot.sendMessage(
          chatId,
          message,
          this.utilsService.getOptions('createdcourses', webAppUrl, language),
        );
        break;

      // Purchased courses
      case '/purchasedcourses':
        message = this.utilsService.getTranslatedMessage(
          language,
          'purchased_courses',
          '📘',
          '🚀',
        );
        await bot.sendMessage(
          chatId,
          message,
          this.utilsService.getOptions('purchasedcourses', webAppUrl, language),
        );
        break;

      // Start
      case '/start':
        message = this.utilsService.getTranslatedMessage(
          language,
          'start',
          '🚀',
          '🎓',
        );

        await bot.sendMessage(
          chatId,
          message,
          this.utilsService.getOptions('start', webAppUrl, language),
        );
        break;

      // Personal data
      case '/personaldata':
        message = this.utilsService.getTranslatedMessage(
          language,
          'personal_data_edit',
          '🔒',
          '📝',
        );
        await bot.sendMessage(
          chatId,
          message,
          this.utilsService.getOptions('personaldata', webAppUrl, language),
        );
        break;
    }
  }

  // Handler of the phone receiving event
  async handlePhoneMessage(dto: HandlePhoneMessageType) {
    const { phone, user, chatId, bot, webAppUrl, language } = dto;

    // Save the new data from TG with phone number to the database
    await this.userService.saveDataFromTG(user, phone);

    // Response
    await this.handleTextCommand({
      text: '/create',
      userId: user.id,
      chatId,
      bot,
      webAppUrl,
      language,
    });
  }
}
