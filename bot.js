require('dotenv').config();
const { Telegraf } = require('telegraf');
const { getData, saveData } = require('./storage');

const bot = new Telegraf(process.env.BOT_TOKEN);

function normalize(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

bot.start((ctx) => {
  const data = getData();
  data.adminChatId = ctx.from.id;
  saveData(data);
  ctx.reply('Bot online. Seu chat foi configurado para alertas.');
});

bot.command('add', (ctx) => {
  const raw = ctx.message.text.split(' ').slice(1).join(' ').trim();
  const keyword = normalize(raw);

  if (!keyword) return ctx.reply('Use: /add palavra');

  const data = getData();
  if (!data.keywords.includes(keyword)) data.keywords.push(keyword);
  saveData(data);

  ctx.reply(`Keyword adicionada: ${keyword}`);
});

bot.command('remove', (ctx) => {
  const raw = ctx.message.text.split(' ').slice(1).join(' ').trim();
  const keyword = normalize(raw);

  const data = getData();
  const before = data.keywords.length;
  data.keywords = data.keywords.filter((k) => k !== keyword);
  saveData(data);

  if (before === data.keywords.length) {
    return ctx.reply(`Keyword não encontrada: ${keyword}`);
  }

  ctx.reply(`Keyword removida: ${keyword}`);
});

bot.command('list', (ctx) => {
  const data = getData();
  const list = data.keywords.length ? data.keywords.join('\n- ') : 'nenhuma';
  ctx.reply(`Keywords atuais:\n- ${list}`);
});

module.exports = bot;