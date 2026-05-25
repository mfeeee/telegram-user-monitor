require('dotenv').config();

module.exports = {
  API_ID: Number(process.env.API_ID),
  API_HASH: process.env.API_HASH,
  PHONE_NUMBER: process.env.PHONE_NUMBER,
};