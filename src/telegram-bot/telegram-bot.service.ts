import { InjectRedis } from '@nestjs-modules/ioredis';
import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Redis } from 'ioredis';
import * as TelegramBot from 'node-telegram-bot-api';
import { CourseService } from '../course/course.service';
import { ImageService } from '../image/image.service';

@Injectable()
export class TelegramBotService implements OnModuleInit {
  private bot: TelegramBot;
  private readonly webAppURL: string;

  constructor(
    private configService: ConfigService,
    private courseService: CourseService,
    private imageService: ImageService,
    @InjectRedis() private readonly redisClient: Redis,
  ) {
    this.webAppURL = this.configService.get<string>('WEB_APP_URL');
    if (!this.webAppURL) {
      throw new Error('WEB_APP_URL is not defined in the env');
    }
  }

  onModuleInit() {
    const token = this.configService.get<string>('BOT_TOKEN');
    if (!token) {
      throw new Error('BOT_TOKEN is not defined in the env');
    }

    this.bot = new TelegramBot(token, { polling: true });
    this.setupListeners();
  }

  private setupListeners() {
    this.bot.on('message', async (msg) => {
      const chatId = msg.chat.id;
      const text = msg.text;

      switch (text) {
        case '/create':
          console.log('create');
          await this.bot.sendMessage(
            chatId,
            '✍️ Click the button below if you want to create your own online course',
            this.getOptions('create'),
          );
          break;

        case '/start':
        default:
          console.log('start');
          await this.bot.sendMessage(
            chatId,
            '🛒 Click the button below if you want to buy an online course',
            this.getOptions('start'),
          );
          break;
      }

      if (msg?.web_app_data?.data) {
        try {
          const data = JSON.parse(msg.web_app_data.data);
          console.log('msg', msg);
          console.log('data', data);

          try {
            const course = await this.courseService.create({
              ...data,
              userId: msg.from.id,
              userName: msg.from.first_name,
            });

            // Save courseId in Redis with a chatId-dependent key
            await this.redisClient.set(`courseId:${chatId}`, course.id);
          } catch (error) {
            throw new InternalServerErrorException(
              'Something went wrong, please try again',
              error?.message,
            );
          }

          await this.bot.sendMessage(
            chatId,
            `🎉 Congratulations, you've successfully created a ${data?.name} course! 🌟 Now let's add an image. Just send a suitable photo directly to this chat! 📸`,
          );
        } catch (error) {
          console.error(error);
        }
      }

      console.log('msg.photo', msg.photo);
      if (msg.photo) {
        const courseId = await this.redisClient.get(`courseId:${chatId}`);
        console.log('courseId', courseId);
        if (courseId) {
          // Get a link to the file
          const fileId = msg.photo[msg.photo.length - 1].file_id; // last (largest) photo
          console.log('fileId', fileId);
          const fileLink = await this.bot.getFileLink(fileId);
          console.log('fileLink', fileLink);
          // Upload the file using axios
          const response = await axios({
            method: 'get',
            url: fileLink,
            responseType: 'stream',
          });

          console.log('response.data', response.data);

          try {
            await this.imageService.upload(response.data, courseId);
            await this.bot.sendMessage(chatId, 'Image successfully uploaded!');
          } catch (error) {
            await this.bot.sendMessage(chatId, 'Error uploading the image.');
          }
        }
      }
    });
  }

  private getOptions(type: string) {
    let url;
    let text;
    let typeKeyboard;

    switch (type) {
      case 'create':
        url = `${this.webAppURL}/create`;
        text = '📝 Please fill out the form to create a course.';
        typeKeyboard = 'keyboard';
        break;
      default:
      case 'start':
        url = this.webAppURL;
        text = '📚 View courses';
        typeKeyboard = 'inline_keyboard';
        break;
    }

    return {
      reply_markup: {
        [typeKeyboard]: [[{ text, web_app: { url } }]],
      },
    };
  }
}
