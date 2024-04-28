import * as dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
dotenv.config();

const token = process.env.BOT_TOKEN;
const appURL = process.env.APP_URL;

if (!token || !appURL) {
  throw Error('token or app url not found');
}

const bot = new TelegramBot(token, { polling: true });

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  const getOptions = (type) => {
    let url;
    let text;
    switch (type) {
      case 'create':
        url = `${appURL}create`;
        text = 'Create course';
        console.log('url', url);
        break;
      default:
      case 'start':
        url = appURL;
        text = 'View courses';
        break;
    }

    return {
      reply_markup: {
        inline_keyboard: [[{ text, web_app: { url } }]],
      },
    };
  };

  switch (text) {
    case '/create':
      await bot.sendMessage(
        chatId,
        'Click the button below if you want to create your own online course',
        getOptions('create')
      );
      break;

    case '/start':
    default:
      await bot.sendMessage(
        chatId,
        'Click the button below if you want to buy online course',
        getOptions('start')
      );
      break;
  }
});
