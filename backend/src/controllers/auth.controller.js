const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 验证必填字段
    if (!username || !email || !password) {
      return res.status(400).json({ 
        message: '用户名、邮箱和密码不能为空' 
      });
    }

    // 检查用户是否已存在
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: '用户名或邮箱已被注册' 
      });
    }

    // 创建用户
    const user = await User.create({ username, email, password });

    // 生成 token
    const token = generateToken(user._id);

    res.status(201).json({
      message: '注册成功',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        },
        token
      }
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ 
      message: '服务器错误', 
      error: error.message 
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 验证必填字段
    if (!email || !password) {
      return res.status(400).json({ 
        message: '邮箱和密码不能为空' 
      });
    }

    // 查找用户（包含密码字段）
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: '邮箱或密码错误' });
    }

    // 验证密码
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: '邮箱或密码错误' });
    }

    // 生成 token
    const token = generateToken(user._id);

    res.json({
      message: '登录成功',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar
        },
        token
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ 
      message: '服务器错误', 
      error: error.message 
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    res.json({
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({ 
      message: '服务器错误', 
      error: error.message 
    });
  }
};
