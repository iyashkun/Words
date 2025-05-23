const { Bot } = require("grammy");
const randomWords = require("random-words");

const bot = new Bot("8159999156:AAFOqpydahyx45IWID9-s6N-kQW5Qo6EClc");
const CHANNEL_ID = "-1002406357808";

let interval = null;
const sentWords = new Set();

function generateFiveLetterWords(count = 50) {
  const result = [];
  while (result.length < count) {
    const word = randomWords({ exactly: 1, maxLength: 5, formatter: w => w.toLowerCase() })[0];
    if (word.length === 5 && /^[a-z]{5}$/.test(word) && !sentWords.has(word)) {
      sentWords.add(word);
      result.push(word);
    }
  }
  return result;
}

function sendWordsToChannel() {
  const words = generateFiveLetterWords(50);
  const message = words.map((w, i) => `${i + 1}. ${w} @${generateRandomUsername()}`).join("\n");
  bot.api.sendMessage(CHANNEL_ID, message);
}

function generateRandomUsername() {
  const username = randomWords({ exactly: 1, maxLength: 5 })[0];
  return /^[a-z]{5}$/.test(username) ? username : "user" + Math.floor(Math.random() * 9999);
}

bot.command("start_process", (ctx) => {
  if (interval) return ctx.reply("Already running.");
  interval = setInterval(sendWordsToChannel, 10000);
  ctx.reply("Process started. Sending words every 10 seconds.");
});

bot.command("stop_process", (ctx) => {
  if (!interval) return ctx.reply("No process running.");
  clearInterval(interval);
  interval = null;
  ctx.reply("Process stopped.");
});

bot.start();
