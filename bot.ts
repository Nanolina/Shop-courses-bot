import * as dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
dotenv.config();

const token = process.env.BOT_TOKEN;
const appURL = process.env.APP_URL;

if (!token || !appURL) {
  throw Error('token or app url not found');
}

const bot = new TelegramBot(token, { polling: true });

bot.on('message', async (msg: any) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  const options = {
    reply_markup: {
      inline_keyboard: [[{ text: 'Courses', web_app: { url: appURL } }]],
    },
  };

  if (text === '/start') {
    await bot.sendMessage(
      chatId,
      'Click the button below if you want to buy or create your own online course',
      options
    );
  }
});
