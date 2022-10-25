//Telegram BOT Config
import TelegramBot from 'node-telegram-bot-api';

//REST API express Server
import express from 'express';

//Configure CORS
import cors from 'cors';

//ENV SETUP
import dotenv from 'dotenv';
dotenv.config();

//MONGO DB Client Lib
import mongoose from 'mongoose';
//DB Lib
import { Products } from '../models/product.model.js';

import { apiAccessLogger, apiPlainLogger, apiBdsccLogger } from '../config/winston.js';

//DB Connection Setup
const dbConnOptions = {
  authSource: 'admin',
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const dbConnUrl = `mongodb://${process.env.DB_URL}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
//Connect Database
mongoose.connect(dbConnUrl, dbConnOptions).catch((error) => {
  console.log(error);
});

//User Lib
import * as em from './email.js';
import { APIToken } from '../models/apiToken.model.js';
import { APIKey } from '../models/apiKey.model.js';
import { Images } from '../models/img.model.js';
import morgan from 'morgan';

//Open Server
const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('combined', { stream: apiAccessLogger.stream }));

//------------------------------------------------------------------------------------------

//SETUP GLOBAL CONST
const SERVER_PORT = process.env.SERVER_PORT;
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const SERVER_NAME = 'Backend_TEST';
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

//------------------------------------------------------------------------------------------
//APIs

app.get('/products', async (req, res) => {
  if (
    req.query.api_key === null ||
    req.query.page === null ||
    req.query.api_key === undefined ||
    req.query.page === undefined ||
    req.query.api_key === NaN ||
    req.query.page === NaN
  )
    res.status(400).send('fail');
  else {
    const req_key = req.query.api_key;
    const response = await APIKey.findById(req_key)
      .exec()
      .catch((err) => {
        console.log(err);
      });

    if (response !== null) {
      if (req.query.page == null) {
        res.status(404).send('no page');
      } else {
        const pageNum = Number(req.query.page);
        const dbData = await Products.find().catch((err) => {
          console.log(err);
          res.status(400).send(err);
        });
        const maxPage = dbData.length % 30 == 0 ? Math.floor(dbData.length / 30) : Math.floor(dbData.length / 30) + 1;
        let result;
        if (pageNum < 0 || pageNum > maxPage) {
          res.status(404).send('no page');
        } else {
          result = dbData.slice(pageNum * 30 - 30, pageNum * 30);
        }
        const date = new Date().toISOString();
        console.log(`${date} data sent! to ${response.name}`);
        bot.sendMessage(CHAT_ID, `${SERVER_NAME} | ${date} Data Sent to ${response.name}`);
        apiPlainLogger.info(`${SERVER_NAME} | Data Sent to ${response.name}`);
        result.push({ eof: dbData.length, maxPage });
        res.status(200).send(result);
      }
    } else {
      res.status(400).send('Auth Fail');
    }
  }
});

app.post('/getToken', async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  console.log(name, email);
  const token = String(Math.floor(Math.random() * 10 ** 6)).padStart(6, '0');
  em.sendEmail(em.createTokenTemplate({ name, token }), email, 'API Key 발급 인증 번호 안내');
  const date = new Date().toISOString();
  bot.sendMessage(CHAT_ID, `${SERVER_NAME} | ${date} 인증번호 ${token}가 ${email}로 발송되었습니다.`);
  apiPlainLogger.info(`${SERVER_NAME} | 인증번호 ${token}가 ${email}로 발송되었습니다.`);
  const response = await APIToken.findOneAndUpdate({ email }, { token })
    .setOptions({ new: true })
    .catch((err) => {
      console.log(err);
      res.status(400).send(err);
    });
  if (response == null) {
    await new APIToken({ name, email, token, isAuth: false }).save().catch((err) => {
      console.log(err);
      res.status(400).send(err);
    });
    res.status(200).send('new token generated');
  } else {
    await APIToken.findOneAndUpdate({ email }, { isAuth: false })
      .setOptions({ new: true })
      .catch((err) => {
        console.log(err);
        res.status(400).send(err);
      });
    res.status(200).send('new token generated');
  }
});

app.patch('/validation', async (req, res) => {
  const token = req.body.token;
  const email = req.body.email;

  const response = await APIToken.findOneAndUpdate({ email, token }, { isAuth: true })
    .setOptions({ new: true })
    .catch((err) => {
      console.log(err);
      res.status(400).send(err);
    });
  if (response == null) {
    const date = new Date().toISOString();
    bot.sendMessage(CHAT_ID, `${SERVER_NAME} | ${date} 인증 번호 발송 실패 ${req.body.name}, ${email}, ${token}`);
    apiPlainLogger.error(`${SERVER_NAME} | 인증 번호 발송 실패 ${req.body.name}, ${email}, ${token}`);
    res.status(200).send('fail');
  } else {
    const date = new Date().toISOString();
    bot.sendMessage(CHAT_ID, `${SERVER_NAME} | ${date} 인증 번호 발송 실패 ${req.body.name}, ${email}, ${token}`);
    apiPlainLogger.info(`${SERVER_NAME} | 인증 번호 발송 성공 ${req.body.name}, ${email}, ${token}`);
    res.status(200).send('success');
  }
});

app.post('/getAPI', async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const response = await APIToken.findOne({ name, email }).catch((err) => {
    console.log(err);
  });
  // console.log(response);
  if (response.isAuth == 'true') {
    const check = await APIKey.findOne({ name, email });
    if (check == null) {
      await new APIKey({ name, email }).save();
    }
    const doubleCheck = await APIKey.findOne({ name, email });
    const date = new Date().toISOString();
    bot.sendMessage(CHAT_ID, `${SERVER_NAME} | ${date} API Key 발급 성공 ${name}, ${email}, ${doubleCheck._id}`);
    apiPlainLogger.info(`${SERVER_NAME} | API Key 발급 성공 ${name}, ${email}, ${doubleCheck._id}`);
    em.sendEmail(em.createKeyTemplate({ name, key: doubleCheck._id }), email, 'API Key 발급 성공');
    res.status(200).send(doubleCheck._id);
  } else {
    res.status(500).send('fail');
  }
});

app.get('/image', async (req, res) => {
  if (
    req.query.api_key === null ||
    req.query.name === null ||
    req.query.api_key === undefined ||
    req.query.name === undefined ||
    req.query.api_key === NaN ||
    req.query.name === NaN
  )
    res.status(400).send('fail');
  else {
    const req_key = req.query.api_key;
    const response = await APIKey.findById(req_key)
      .exec()
      .catch((err) => {
        console.log(err);
      });
    console.log(response);
    if (response === null) {
      res.status(400).send('fail');
    } else {
      if (Number(req.query.name) > 13) res.status(400).send('fail');
      else {
        const rand = Math.floor(Math.random() * 9) + 1;
        console.log(`Sending ${rand} image to ${response.name}`);
        const data = await Images.findOne({ seq: rand + Number(req.query.name) * 10 - 10 });
        const date = new Date().toISOString();
        bot.sendMessage(CHAT_ID, `${SERVER_NAME} | ${date} Image #${rand} is sent to ${response.name}, ${data.img}`);
        apiPlainLogger.info(`${SERVER_NAME} | Image #${rand} is sent to ${response.name}, ${data.img}`);
        res.status(200).send(data);
      }
    }
  }
});

app.get('/images', async (req, res) => {
  const data = await Images.find();
  res.status(200).send(data);
});

//����
app.post('/image', async (req, res) => {
  if (req.body.name === null || req.body.img === null) res.status(400).send('fail');
  else if (req.body.name === undefined || req.body.img === undefined) res.status(400).send('fail');
  else if (req.body.name === NaN || req.body.img === NaN) res.status(400).send('fail');
  else if (req.body.name === '' || req.body.img === '') res.status(400).send('fail');
  else {
    if (typeof req.body.name !== 'number' || typeof req.body.img !== 'string') {
      res.status(400).send('fail');
    } else {
      const name = req.body.name;
      const img = req.body.img;
      const response = await APIKey.findOne({ name, email }).catch((err) => {
        console.log(err);
      });
      if (response == null) {
        res.status(400).send('fail');
      } else {
        const date = new Date().toISOString();
        bot.sendMessage(CHAT_ID, `${SERVER_NAME} | ${date} Image #${seq} is created by ${name}, ${img}`);
        apiPlainLogger.info(`${SERVER_NAME} | Image #${seq} is created by ${name}, ${img}`);
        const result = await new Images({ name, img }).save();
        //res result
        res.status(200).send(result);
      }
    }
  }
});

app.get('/bdscc', async (req, res) => {
  console.log(req.query.message);
  const message = req.query.message;
  let type = req.query.type;
  if (req.query.type === null || req.query.type === undefined || req.query.type === NaN || req.query.type === '') type = 'DEFAULT';
  else type = req.query.type;
  apiBdsccLogger.info(type + ' | ' + message);
  console.log(message);
  res.status(200).send('success');
});

//------------------------------------------------------------------------------------------

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  console.log(`received message from ${chatId}
${text}`);
});

app.listen(SERVER_PORT, () => {
  const date = new Date().toISOString();
  apiPlainLogger.info('Server running on port ' + SERVER_PORT);
  bot.sendMessage(CHAT_ID, `${SERVER_NAME} | ${date} Server running on port ${SERVER_PORT}`);
  console.log(`${date} Server running on port ${SERVER_PORT}`);
});
