const path = require('path');
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
    tdlibParameters: {
      database_directory: path.join(__dirname, 'persistente', '_td_database'),
      files_directory: path.join(__dirname, 'persistente', '_td_files'),
      use_message_database: false,
      use_secret_chats: false,
      system_language_code: 'en',
      device_model: 'Railway Server',
      system_version: 'Linux',
      application_version: '1.0.0'
    }
  });

  await client.login({
    getPhoneNumber: () => Promise.resolve(PHONE_NUMBER),
    getAuthCode: askInput,
    getPassword: askInput,
  });

  return client;
}

module.exports = { createTelegramClient };