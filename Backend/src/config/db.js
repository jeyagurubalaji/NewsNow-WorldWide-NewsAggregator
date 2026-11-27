const mongoose = require('mongoose');
const env = require('./env');

let cachedPromise = null;

async function connectDb() {
  if (mongoose.connection.readyState === 1) return;

  if (!cachedPromise) {
    cachedPromise = mongoose.connect(env.mongodbUri).then((conn) => {
      console.log('[db] Connected to MongoDB');
      return conn;
    });
  }

  await cachedPromise;
}

module.exports = { connectDb };