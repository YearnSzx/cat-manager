const mongoose = require('mongoose');

let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    cachedConnection = await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB 连接成功');
    return cachedConnection;
  } catch (error) {
    console.error('❌ MongoDB 连接失败:', error.message);
    cachedConnection = null;
    throw error;
  }
};

module.exports = connectDB;
