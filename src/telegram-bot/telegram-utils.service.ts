import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelegramUtilsService {
  constructor(private configService: ConfigService) {}

  getWebUrl(userId: number) {
    console.log('userId', userId);
    // Alina developer
    const AlinaId = this.configService.get<string>('ALINA_ID');
    const webAppUrlAlina = this.configService.get<string>('WEB_APP_URL_ALINA');

    // Sneganna developer
    const SnegannaId = this.configService.get<string>('SNEGANNA_ID');
    const webAppUrlSneganna = this.configService.get<string>(
      'WEB_APP_URL_SNEGANNA',
    );

    // All users
    const webAppUrl = this.configService.get<string>('WEB_APP_URL');

    if (userId === Number(AlinaId)) {
      return webAppUrlAlina;
    } else if (userId === Number(SnegannaId)) {
      return webAppUrlSneganna;
    } else {
      return webAppUrl;
    }
  }

  getOptions(type: string, webAppUrl: string) {
    let url;
    let text;
    let replyMarkup;

    switch (type) {
      case 'create':
        url = `${webAppUrl}/course/create`;
        text = '🎓 Create New Course';
        replyMarkup = {
          inline_keyboard: [[{ text, web_app: { url } }]],
        };
        break;
      case 'createdcourses':
        url = `${webAppUrl}/course/created`;
        text = '📚 View My Created Courses';
        replyMarkup = {
          inline_keyboard: [[{ text, web_app: { url } }]],
        };
        break;
      case 'purchasedcourses':
        url = `${webAppUrl}/course/purchased`;
        text = '📘 View My Purchased Courses';
        replyMarkup = {
          inline_keyboard: [[{ text, web_app: { url } }]],
        };
        break;
      case 'start':
      default:
        url = webAppUrl;
        text = '🌟 Explore Courses';
        replyMarkup = {
          inline_keyboard: [[{ text, web_app: { url } }]],
        };
        break;
    }

    return { reply_markup: replyMarkup };
  }
}
