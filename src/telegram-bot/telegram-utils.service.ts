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

  // sendData in the web app can work only for Keyboard button
  getOptions(type: string, webAppUrl: string, userId?: number) {
    let url;
    let text;
    let replyMarkup;

    switch (type) {
      case 'create':
        url = `${webAppUrl}/course/create`;
        text = '📝 Create';
        replyMarkup = {
          keyboard: [[{ text, web_app: { url } }]],
          resize_keyboard: true,
        };
        break;
      case 'mycreatedcourses':
        if (!userId) break;
        url = `${webAppUrl}/course/user/${userId}`;
        text = 'Press me to see your courses';
        replyMarkup = {
          keyboard: [[{ text, web_app: { url } }]],
          resize_keyboard: true,
        };
        break;
      case 'start':
        url = webAppUrl;
        text = '📚 View courses';
        replyMarkup = {
          inline_keyboard: [[{ text, web_app: { url } }]],
        };
        break;
      case 'module':
      default:
        url = `${webAppUrl}/module`;
        text = '📝 Create modules';
        replyMarkup = {
          keyboard: [[{ text, web_app: { url } }]],
          resize_keyboard: true,
        };
        break;
    }

    return { reply_markup: replyMarkup };
  }

  // Providing options for retrying the action or asking for help
  getRetryOptions() {
    const retryText = '🔄 Try again';
    const helpText = '❓ Need help';

    return {
      reply_markup: {
        inline_keyboard: [
          [{ text: retryText, callback_data: 'retry' }],
          [{ text: helpText, callback_data: 'help' }],
        ],
      },
    };
  }
}
