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

    // Snezhanna developer
    const SnezhannaId = this.configService.get<string>('SNEZHANNA_ID');
    const webAppUrlSnezhanna = this.configService.get<string>(
      'WEB_APP_URL_SNEZHANNA',
    );

    // All users
    const webAppUrl = this.configService.get<string>('WEB_APP_URL');

    if (userId === Number(AlinaId)) {
      return webAppUrlAlina;
    } else if (userId === Number(SnezhannaId)) {
      return webAppUrlSnezhanna;
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
        text = '📚 My Created Courses';
        replyMarkup = {
          inline_keyboard: [[{ text, web_app: { url } }]],
        };
        break;
      case 'purchasedcourses':
        url = `${webAppUrl}/course/purchased`;
        text = '📘 My Purchased Courses';
        replyMarkup = {
          inline_keyboard: [[{ text, web_app: { url } }]],
        };
        break;
      case 'start':
      default:
        url = webAppUrl;
        text = '🌟 Choose a course';
        replyMarkup = {
          inline_keyboard: [[{ text, web_app: { url } }]],
        };
        break;
    }

    return { reply_markup: replyMarkup };
  }
}
