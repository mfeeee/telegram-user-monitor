const tdl = require('tdl');
const { getTdjson } = require('prebuilt-tdlib');
const { API_ID, API_HASH, PHONE_NUMBER } = require('./config');

function askInput() {
  return new Promise((resolve) => {
    process.stdin.once('data', (data) => resolve(data.toString().trim()));
  });
}

async function createTelegramClient() {
  tdl.configure({ tdjson: getTdjson() });

  const client = tdl.createClient({
    apiId: API_ID,
    apiHash: API_HASH,
  });

  await client.login({
    getPhoneNumber: () => Promise.resolve(PHONE_NUMBER),
    getAuthCode: askInput,
    getPassword: askInput,
  });

  return client;
}

module.exports = { createTelegramClient };