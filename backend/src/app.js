const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const connectDB = require('./config/database');
const authRoutes = require('./routes/auth.routes');
const catRoutes = require('./routes/cat.routes');  // ←
const uploadRoutes = require('./routes/upload.routes');



// 加载环境变量
dotenv.config();

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use('/api/uploads', express.static(path.join(__dirname, '../uploads')));


// 路由
app.use('/api/auth', authRoutes);
app.use('/api/cats', catRoutes);  //
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

// 连接数据库
connectDB();

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
});
