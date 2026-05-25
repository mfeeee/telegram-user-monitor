const { saveData } = require('./storage');

async function loadGroups(client, data) {
  const chats = await client.invoke({
    _: 'getChats',
    chat_list: { _: 'chatListMain' },
    limit: 100,
  });

  data.monitoredChats = [];

  for (const chatId of chats.chat_ids) {
    const chat = await client.invoke({ _: 'getChat', chat_id: chatId });
    if (chat.type?._ === 'chatTypeBasicGroup' || chat.type?._ === 'chatTypeSupergroup') {
      data.monitoredChats.push(chat.id);
      await client.invoke({ _: 'openChat', chat_id: chat.id });
      console.log(`Monitorando: ${chat.title} (${chat.id})`);
    }
  }

  console.log('monitoredChats final:', data.monitoredChats);
  saveData(data);
}

module.exports = { loadGroups };