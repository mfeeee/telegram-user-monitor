const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'data.json');

function loadData() {
  if (!fs.existsSync(filePath)) {
    return { keywords: [], monitoredChats: [], adminChatId: null };
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function saveData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function getData() {
  return loadData();
}

module.exports = { getData, saveData };