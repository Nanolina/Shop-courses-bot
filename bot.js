import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
import TelegramBot from 'node-telegram-bot-api';
dotenv.config();

const token = process.env.BOT_TOKEN;
const webAppURL = process.env.WEB_APP_URL;

if (!token || !webAppURL) {
  throw Error('token or web app url not found');
}

const bot = new TelegramBot(token, { polling: true });
const app = express();

app.use(express.json());
app.use(cors());

const getOptions = (type) => {
  let url;
  let text;
  let typeKeyboard;
  switch (type) {
    case 'create':
      url = `${webAppURL}/create`;
      text = 'Fill out the form to create a course';
      typeKeyboard = 'keyboard';
      break;
    default:
    case 'start':
      url = webAppURL;
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
  console.log('dataFromUser', dataFromUser);

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

  console.log('msg', msg);
  if (msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg?.web_app_data?.data);
      console.log('data', data);
      await bot.sendMessage('THANK YOU!');
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

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/course', async (req, res) => {
  console.log('req.body', req.body);
  const { queryId, course } = req.body;
  console.log('queryId, course', { queryId, course });

  try {
    await bot.answerWebAppQuery(queryId, {
      type: 'article',
      id: queryId,
      title: 'Successful purchase',
      input_message_content: {
        message_text: `Congratulations! You have successfully created your own course ${course.shortTitle}`,
      },
    });

    return res.status(200).json({});
  } catch (error) {
    await bot.answerWebAppQuery(queryId, {
      type: 'article',
      id: queryId,
      title: 'Failed to create a course, please try again',
      input_message_content: {
        message_text: 'Failed to create a course, please try again',
      },
    });

    return res.status(500).json({});
  }
});

const PORT = 8000;
app.listen(PORT, () => console.log('server started on PORT', PORT));
