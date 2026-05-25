const bot = require('./bot');
const { createTelegramClient } = require('./telegramClient');
const { loadGroups } = require('./chatService');
const { startMonitor } = require('./monitor');
const { sendAlert } = require('./alertService');
const { getData } = require('./storage');

process.on('unhandledRejection', (err) => {
  console.error('unhandledRejection:', err?.message || err);
});

async function main() {
  const data = getData();
  const client = await createTelegramClient();

  await loadGroups(client, data);
  startMonitor(client, data, sendAlert, bot);

  bot.catch((err) => {
    console.error('Bot middleware error:', err.message);
  });

  await bot.launch();
  console.log('Bot e monitor rodando');

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

main().catch((err) => {
  console.error('Erro fatal no main():', err.message);
  process.exit(1);
});