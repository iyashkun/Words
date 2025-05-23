const { Bot } = require("grammy");

const bot = new Bot("8159999156:AAFOqpydahyx45IWID9-s6N-kQW5Qo6EClc");
const CHANNEL_ID = "-1002406357808";

let interval = null;
const sentCombos = new Set();

function randomUsername() {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  let username = "";
  while (username.length < 5) {
    username += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return username;
}

function generatePairs(count = 50) {
  const pairs = [];
  while (pairs.length < count) {
    const user1 = randomUsername();
    const user2 = randomUsername();
    const comboKey = `${user1}|${user2}`;
    if (!sentCombos.has(comboKey)) {
      sentCombos.add(comboKey);
      pairs.push({ user1, user2 });
    }
  }
  return pairs;
}

function sendMessage() {
  const pairs = generatePairs();
  const message = pairs.map((pair, i) => `${i + 1}. @${pair.user1} | @${pair.user2}`).join("\n");
  bot.api.sendMessage(CHANNEL_ID, message);
}

bot.command("start_process", (ctx) => {
  if (interval) return ctx.reply("Already running.");
  interval = setInterval(sendMessage, 10000);
  ctx.reply("Started sending every 10s.");
});

bot.command("stop_process", (ctx) => {
  if (!interval) return ctx.reply("Not running.");
  clearInterval(interval);
  interval = null;
  ctx.reply("Stopped.");
});

bot.start();
