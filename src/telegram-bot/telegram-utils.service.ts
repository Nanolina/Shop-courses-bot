import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelegramUtilsService {
  private readonly webAppURL: string;

  constructor(private configService: ConfigService) {
    this.webAppURL = this.configService.get<string>('WEB_APP_URL');
    if (!this.webAppURL) {
      throw new Error('WEB_APP_URL is not defined in the env');
    }
  }

  getOptions(type: string, userId?: number) {
    let url;
    let text;
    let replyMarkup;

    switch (type) {
      case 'create':
        url = `${this.webAppURL}/course/create`;
        text = '📝 Create';
        replyMarkup = {
          keyboard: [[{ text, web_app: { url } }]],
          resize_keyboard: true,
        };
        break;
      case 'mycreatedcourses':
        url = `${this.webAppURL}/course/user/${userId}`;
        text = 'Press me to see your courses';
        replyMarkup = {
          keyboard: [[{ text, web_app: { url } }]],
          resize_keyboard: true,
        };
        break;
      case 'start':
      default:
        url = this.webAppURL;
        text = '📚 View courses';
        replyMarkup = {
          inline_keyboard: [[{ text, web_app: { url } }]],
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
