const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // 获取 token
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: '未授权，请先登录' });
    }

    const token = authHeader.split(' ')[1];

    // 验证 token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 将 userId 附加到请求对象
    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.error('认证错误:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: '登录已过期，请重新登录' });
    }
    res.status(401).json({ message: '无效的 token' });
  }
};

module.exports = authMiddleware;
