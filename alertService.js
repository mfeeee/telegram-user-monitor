async function sendAlert(bot, adminChatId, groupTitle, messageText, hits) {
  const text =
    `🚨 Alerta de produto\n` +
    `Grupo: ${groupTitle}\n` +
    `Keywords: ${hits.join(', ')}\n` +
    `Mensagem: ${messageText}`;

  const MAX_ATTEMPTS = 4;
  const DELAY_MS = 3000;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      await bot.telegram.sendMessage(adminChatId, text);
      return;
    } catch (err) {
      const TRANSIENT_CODES = ['ENOTFOUND', 'ECONNRESET', 'ETIMEDOUT', 'ECONNREFUSED', 'EAI_AGAIN'];
      const transient = TRANSIENT_CODES.includes(err.code) || err.type === 'system';
      if (!transient || attempt === MAX_ATTEMPTS) throw err;
      console.warn(`sendAlert attempt ${attempt} failed (${err.code}), retrying in ${DELAY_MS}ms…`);
      await new Promise((r) => setTimeout(r, DELAY_MS));
    }
  }
}

module.exports = { sendAlert };
