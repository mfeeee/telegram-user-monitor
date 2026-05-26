const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'persistente', 'data.json');

function loadData() {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    return { keywords: [], monitoredChats: [], adminChatId: null };
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function saveData(data) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function getData() {
  return loadData();
}

module.exports = { getData, saveData };