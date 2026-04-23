const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, '用户名不能为空'],
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  email: {
    type: String,
    required: [true, '邮箱不能为空'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, '密码不能为空'],
    minlength: 6,
    select: false
  },
  avatar: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Mongoose 8.x - async 函数不需要调用 next()
userSchema.pre('save', async function() {
  // 只在新建或修改密码时加密
  if (!this.isModified('password')) {
    return;
  }
  
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(this.password, salt);
  this.password = hash;
});

// 密码比对方法
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
