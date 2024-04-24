import * as dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
dotenv.config();
const token = process.env.BOT_TOKEN;
const appURL = process.env.APP_URL;
if (!token || !appURL) {
    throw Error('token or app url not found');
}
const bot = new TelegramBot(token, { polling: true });
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const options = {
        reply_markup: {
            inline_keyboard: [[{ text: 'Open courses', web_app: { url: appURL } }]],
        },
    };
    bot.sendMessage(chatId, 'Click the button below to open the app:', options);
});
