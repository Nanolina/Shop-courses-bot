import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getTranslatedText } from '../translation';

@Injectable()
export class TelegramUtilsService {
  constructor(private configService: ConfigService) {}

  getTranslatedMessage(
    language: string,
    text: string,
    iconStart?: string,
    iconEnd?: string,
  ) {
    const message = getTranslatedText(text, language);
    return `${iconStart ? iconStart : ''} ${message} ${iconEnd ? iconEnd : ''}`;
  }

  getWebUrl(userId: number) {
    console.log('userId', userId);
    // Alina developer
    const AlinaId = this.configService.get<string>('ALINA_ID');
    const Alina2Id = this.configService.get<string>('ALINA_2_ID');
    const webAppUrlAlina = this.configService.get<string>('WEB_APP_URL_ALINA');

    // Snezhanna developer
    const SnezhannaId = this.configService.get<string>('SNEZHANNA_ID');
    const RuslanId = this.configService.get<string>('RUSLAN_ID');
    const webAppUrlSnezhanna = this.configService.get<string>(
      'WEB_APP_URL_SNEZHANNA',
    );

    // All users
    const webAppUrl = this.configService.get<string>('WEB_APP_URL');

    if (userId === Number(AlinaId) || userId === Number(Alina2Id)) {
      return webAppUrlAlina;
    } else if (userId === Number(SnezhannaId) || userId === Number(RuslanId)) {
      return webAppUrlSnezhanna;
    } else {
      return webAppUrl;
    }
  }

  getOptions(type: string, webAppUrl: string, language: string) {
    let url;
    let text;
    let replyMarkup;

    switch (type) {
      case 'create':
        url = `${webAppUrl}/course/create`;
        text = this.getTranslatedMessage(language, 'create_course', '🎓');
        replyMarkup = {
          inline_keyboard: [[{ text, web_app: { url } }]],
        };
        break;
      case 'createdcourses':
        url = `${webAppUrl}/course/created`;
        text = this.getTranslatedMessage(language, 'my_created_courses', '💻');
        replyMarkup = {
          inline_keyboard: [[{ text, web_app: { url } }]],
        };
        break;
      case 'purchasedcourses':
        url = `${webAppUrl}/course/purchased`;
        text = this.getTranslatedMessage(
          language,
          'my_purchased_courses',
          '📚',
        );
        replyMarkup = {
          inline_keyboard: [[{ text, web_app: { url } }]],
        };
        break;
      case 'personaldata':
        url = `${webAppUrl}/user`;
        text = this.getTranslatedMessage(language, 'personal_data', '👤');
        replyMarkup = {
          inline_keyboard: [[{ text, web_app: { url } }]],
          remove_keyboard: true,
        };
        break;
      case 'start':
      default:
        url = webAppUrl;
        text = this.getTranslatedMessage(language, 'choose_course', '🌟');
        replyMarkup = {
          inline_keyboard: [[{ text, web_app: { url } }]],
        };
        break;
    }

    return { reply_markup: replyMarkup };
  }

  getPhoneRequestOptions(language: string) {
    const text = this.getTranslatedMessage(language, 'phone_share', '', '✅');
    return {
      reply_markup: {
        keyboard: [
          [
            {
              text,
              request_contact: true,
            },
          ],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    };
  }
}
