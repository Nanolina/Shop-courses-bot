import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
      const userId = msg.from.id;
      const userName = msg.from.username;
      const dataFromWeb = msg?.web_app_data?.data;

      if (!userId) {
        await this.bot.sendMessage(
          chatId,
          '❌ Unauthorized',
          this.getOptions('start'),
        );
      }

      if (msg.photo) {
        // Check if there is a photo in the message
        const courseId = await this.redisClient.get(`courseId:${chatId}`);
        if (courseId) {
          // Get a reference to the file
          const fileId = msg.photo[1].file_id;
          const temporaryImageUrl = await this.bot.getFileLink(fileId);

          // Send a message about the start of loading
          const message = await this.bot.sendMessage(
            chatId,
            '⏳ Uploading an image...',
          );

          try {
            await this.imageService.upload(temporaryImageUrl, courseId, userId);

            // Update the message after loading
            await this.bot.editMessageText(
              '✅ The image has been successfully uploaded!',
              { chat_id: chatId, message_id: message.message_id },
            );
          } catch (error) {
            await this.bot.editMessageText(
              '⚠️ Error loading the image, please try again',
              { chat_id: chatId, message_id: message.message_id },
            );
          }
        }

        // Finish processing the message if it is a photo
        return;
      }

      // Check text commands
      const text = msg.text;
      switch (text) {
        case '/create':
          await this.bot.sendMessage(
            chatId,
            '✍️ Click the button below if you want to create your own online course',
            this.getOptions('create'),
          );
          break;

        case '/start':
          await this.bot.sendMessage(
            chatId,
            '🛒 Click the button below if you want to buy an online course',
            this.getOptions('start'),
          );
          break;
      }

      // Process web_app data
      if (dataFromWeb) {
        try {
          const data = JSON.parse(dataFromWeb);
          const course = await this.courseService.create({
            ...data,
            userId,
            userName,
          });

          if (!course) {
            await this.bot.sendMessage(
              chatId,
              '❌ Something went wrong, please try again',
              {
                reply_markup: {
                  inline_keyboard: [
                    [
                      {
                        text: 'Create a Course',
                        callback_data: '/create',
                      },
                    ],
                  ],
                },
              },
            );
          }

          // Save courseId in Redis with a chatId-dependent key
          await this.redisClient.set(`courseId:${chatId}`, course.id);

          await this.bot.sendMessage(
            chatId,
            `🎉 Congratulations, you've successfully created a ${data.name} course! 🌟 Now let's add an image. Just send a suitable photo directly to this chat! 📸`,
          );
        } catch (error) {
          await this.bot.sendMessage(
            chatId,
            '❌ Something went wrong, please try again',
            {
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: 'Create a Course',
                      callback_data: '/create',
                    },
                  ],
                ],
              },
            },
          );
        }
      }
    });

    // Callback request handler for inline buttons
    this.bot.on('callback_query', async (callbackQuery) => {
      const message = callbackQuery.message;
      const data = callbackQuery.data;
      const chatId = message.chat.id;

      if (data === '/create') {
        // Clicking the button to create a course
        await this.bot.sendMessage(
          chatId,
          '📝 Please fill out the form to create a course.',
          this.getOptions('create'),
        );
      }
    });
  }

  private getOptions(type: string) {
    let url;
    let text;
    let replyMarkup;

    switch (type) {
      case 'create':
        url = `${this.webAppURL}/create`;
        text = '📝 Please fill out the form to create a course.';
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
}
