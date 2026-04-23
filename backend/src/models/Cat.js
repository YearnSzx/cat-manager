const mongoose = require('mongoose');

const catSchema = new mongoose.Schema({
  // 关联用户（重要！确保每只猫都属于某个用户）
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',        // 引用 User 模型
    required: true
  },
  
  // 猫咪基本信息
  name: {
    type: String,
    required: [true, '猫咪名字不能为空'],
    trim: true,
    maxlength: 50
  },
  
  breed: {
    type: String,
    required: [true, '品种不能为空'],
    trim: true,
    maxlength: 50
  },
  
  gender: {
    type: String,
    enum: ['male', 'female'],  // 只能是这两个值
    required: [true, '性别不能为空']
  },
  
  birthDate: {
    type: Date,
    required: [true, '出生日期不能为空']
  },
  
  color: {
    type: String,
    trim: true,
    default: ''
  },
  
  weight: {
    type: Number,
    default: 0,
    min: 0
  },
  
  isNeutered: {
    type: Boolean,
    default: false
  },
  
  photo: {
    type: String,
    default: ''
  },
  
  notes: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true  // 自动添加 createdAt 和 updatedAt
});

// 创建索引（提高查询效率）
catSchema.index({ userId: 1 });
catSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Cat', catSchema);
