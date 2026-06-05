const mongoose = require("mongoose");

async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/shopadmin";

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000
  });
}

module.exports = { connectDatabase };
