const { getData } = require('./storage');

function normalize(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

const MEDIA_TYPES = [
  'messagePhoto', 'messageVideo', 'messageDocument',
  'messageAnimation', 'messageAudio', 'messageVoiceNote',
];

function extractText(content) {
  if (!content) return '';
  if (content._ === 'messageText') return content.text?.text || '';
  if (MEDIA_TYPES.includes(content._)) return content.caption?.text || '';
  return '';
}

function startMonitor(client, _initialData, sendAlert, bot) {
  client.on('update', async (update) => {
    try {
      if (update._ !== 'updateNewMessage') return;
      const msg = update.message;
      const content = msg.content;

      const originalText = extractText(content);
      if (!originalText) return;

      const data = getData();

      if (!data.monitoredChats.includes(msg.chat_id)) return;

      const text = normalize(originalText);
      const hits = data.keywords.filter((kw) => text.includes(normalize(kw)));

      if (!hits.length) return;

      console.log('ALERTA: chat', msg.chat_id, '| hits:', hits);

      const chat = await client.invoke({ _: 'getChat', chat_id: msg.chat_id });
      if (data.adminChatId) {
        await sendAlert(bot, data.adminChatId, chat.title, originalText, hits);
      }
    } catch (err) {
      console.error('Erro no handler de update:', err.message);
    }
  });
}

module.exports = { startMonitor };