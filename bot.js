import * as dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
dotenv.config();

const token = process.env.BOT_TOKEN;
const appURL = process.env.APP_URL;

if (!token || !appURL) {
  throw Error('token or app url not found');
}

const bot = new TelegramBot(token, { polling: true });

const getOptions = (type) => {
  let url;
  let text;
  let typeKeyboard;
  switch (type) {
    case 'create':
      url = `${appURL}create`;
      text = 'Fill out the form to create a course';
      typeKeyboard = 'keyboard';
      break;
    default:
    case 'start':
      url = appURL;
      text = 'View courses';
      typeKeyboard = 'inline_keyboard';
      break;
  }

  return {
    reply_markup: {
      [typeKeyboard]: [[{ text, web_app: { url } }]],
    },
  };
};

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  const dataFromUser = msg?.web_app_data?.data;
  console.log('msg', msg);

  switch (text) {
    case '/create':
      await bot.sendMessage(
        chatId,
        'Click the button below if you want to create your own online course',
        getOptions('create')
      );
      break;

    case '/start':
      await bot.sendMessage(
        chatId,
        'Click the button below if you want to buy online course',
        getOptions('start')
      );
      break;
  }

  if (dataFromUser) {
    try {
      const data = JSON.parse(dataFromUser);
      await bot.sendMessage(
        chatId,
        `You've created a course ${data?.shortTitle}. Let's now get down to adding videos for your course. Could you please answer if your course will be divided into modules?`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                { text: 'Yes', callback_data: 'YES' },
                { text: 'No', callback_data: 'NO' },
              ],
            ],
          },
        }
      );

      return;
    } catch (error) {
      console.error(error);
    }
  }
});
