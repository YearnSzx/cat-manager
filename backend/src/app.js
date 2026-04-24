const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const connectDB = require('./config/database');
const authRoutes = require('./routes/auth.routes');
const catRoutes = require('./routes/cat.routes');
const uploadRoutes = require('./routes/upload.routes');

dotenv.config();

const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// 中间件
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('CORS blocked for this origin'));
  }
}));
app.use(express.json());

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/cats', catRoutes);
app.use('/api/upload', uploadRoutes);


// 健康检查接口
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '服务器运行中' });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({ message: '接口不存在' });
});

// 错误处理中间件（必须是4个参数）
app.use((err, req, res, next) => {
  console.error('❌ 错误:', err.message);
  res.status(500).json({ 
    message: '服务器内部错误',
    error: err.message 
  });
});

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;

  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error('启动失败:', error.message);
      process.exit(1);
    });
}
