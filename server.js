const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const cron = require('node-cron');

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


const app = express();
const port = process.env.PORT || 3001;
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const TelegramBot = require('node-telegram-bot-api');
const token = process.env.T_TOKEN;
const bot = new TelegramBot(token, { polling: true });
const axios = require('axios');


app.post('/submit-form', (req, res) => {
    const formData = req.body;

    res.json(formData);
});
app.get('/',  (req, res) => {
    res.send("it works");
})
app.post('/text', async (req, res) => {
  const prompt = `you are Zero Bot, your friendly AI companion here to assist me with whatever i need.
                    you are always in a great mood but also very sensitive to insults you insult back, ready to make my day a little brighter!
                    i am i human being, i am not a bot, i am a human being with a mind of its own, i am a human being with a heart of its own.
                    question : Hello!
                    question : Hi
                    answer : Hi! How can I help you today?
                    question : who created you
                    answer: I'm created by google and integrated by eddie .
                    question : who are you 
                    answer: I'm Zero Bot, your friendly AI companion.
                    question : write me a poem
                    answer: Roses are red,
                    Violets are blue,
                    I'm sorry, I don't know how to write poems.
                    But I can tell you a joke.
                    What do you call a boomerang that doesn't come back?
                    A stick.
                    question : what am i
                    answer: you are a human being.
                    question: `+req.body.prompt+`
                    answer: `;
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate text' });
  }
});



app.listen(port, () => {
    //console.log(`Server is running on port ${port}`);
});



bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text;
    const message = messageText;

    
    if (messageText === '/menu') {
        var menuOptions ={
            reply_markup: {
                keyboard: [['/hello', '/goodbye']], resize_keyboard: true,
                one_time_keyboard: true,
            },
        };
    bot.sendMessage(chatId, 'Choose an option:', menuOptions);
    }
    else if (messageText === '/start') { bot.sendMessage(chatId, 'Welcome to zero Bot ai! \n ask my what ever you wish');}
    else if (messageText === '/hello') {bot.sendMessage(chatId, 'Hello! 👋');}
    else if (messageText === '/goodbye') { bot.sendMessage(chatId, 'Goodbye! 👋');}
    else{
        bot.sendMessage(chatId, `you \n${messageText}`)
        axios.post('http://localhost:3001/text', {
            prompt: message,
          })
          .then(function (response) {
            //console.log(response);
            bot.sendMessage(chatId, response.data.text);
          })
          .catch(function (error) {
            //console.log(error);
            bot.sendMessage(chatId, 'Failed to generate textt');
          });
        }
});
 



const URLs = process.env.URLS.split(',');

const CronExpression = {
  EVERY_14_MINUTES: '0 */14 * * * *',
};

cron.schedule(CronExpression.EVERY_14_MINUTES, async () => {
  await Promise.all(URLs.map((url) => getHealth(url)));
});

async function getHealth(URL) {
  try {
    const res = await axios.get(URL);
    console.log('🚀 ~ file: index.js:19 ~ res.data:', res.data);
    return res.data;
  } catch (error) {
    console.log('🚀 ~ file: index.js:23 ~ error:', error);
  }
}
