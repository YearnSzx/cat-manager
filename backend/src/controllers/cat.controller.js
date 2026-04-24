const Cat = require('../models/Cat');

const normalizePhotos = (photos, photo) => {
  const nextPhotos = Array.isArray(photos)
    ? photos.filter((item) => typeof item === 'string' && item.trim())
    : [];

  if (!nextPhotos.length && typeof photo === 'string' && photo.trim()) {
    nextPhotos.push(photo.trim());
  }

  return nextPhotos;
};

const serializeCat = (cat) => {
  const plainCat = cat.toObject ? cat.toObject() : cat;
  const photos = normalizePhotos(plainCat.photos, plainCat.photo);

  return {
    ...plainCat,
    photo: photos[0] || '',
    photos
  };
};

// 获取我的猫咪列表
exports.getCats = async (req, res) => {
  try {
    // 🔒 关键：只查询当前用户的猫咪
    const cats = await Cat.find({ userId: req.userId })
      .sort({ createdAt: -1 });  // 按创建时间倒序
    
    res.json({
      message: '获取成功',
      data: cats.map(serializeCat)
    });
  } catch (error) {
    console.error('获取猫咪列表错误:', error);
    res.status(500).json({ 
      message: '服务器错误', 
      error: error.message 
    });
  }
};

// 获取单个猫咪
exports.getCatById = async (req, res) => {
  try {
    const cat = await Cat.findOne({ 
      _id: req.params.id,
      userId: req.userId  // 🔒 确保只能查看自己的猫
    });
    
    if (!cat) {
      return res.status(404).json({ message: '猫咪不存在' });
    }
    
    res.json({
      message: '获取成功',
      data: serializeCat(cat)
    });
  } catch (error) {
    console.error('获取猫咪详情错误:', error);
    res.status(500).json({ 
      message: '服务器错误', 
      error: error.message 
    });
  }
};

// 创建猫咪
exports.createCat = async (req, res) => {
  try {
    const { name, breed, gender, birthDate, color, weight, isNeutered, photo, photos, notes } = req.body;
    
    // 验证必填字段
    if (!name || !breed || !gender || !birthDate) {
      return res.status(400).json({ 
        message: '名字、品种、性别和出生日期为必填项' 
      });
    }
    
    const normalizedPhotos = normalizePhotos(photos, photo);

    // 🔒 关键：从 token 中获取 userId
    const cat = await Cat.create({
      userId: req.userId,  // 自动关联当前用户
      name,
      breed,
      gender,
      birthDate,
      color: color || '',
      weight: weight || 0,
      isNeutered: isNeutered || false,
      photo: normalizedPhotos[0] || '',
      photos: normalizedPhotos,
      notes: notes || ''
    });
    
    res.status(201).json({
      message: '创建成功',
      data: serializeCat(cat)
    });
  } catch (error) {
    console.error('创建猫咪错误:', error);
    res.status(500).json({ 
      message: '服务器错误', 
      error: error.message 
    });
  }
};

// 更新猫咪
exports.updateCat = async (req, res) => {
  try {
    const { name, breed, gender, birthDate, color, weight, isNeutered, photo, photos, notes } = req.body;
    const normalizedPhotos = normalizePhotos(photos, photo);
    
    // 🔒 查找并更新（确保只能更新自己的猫）
    const cat = await Cat.findOneAndUpdate(
      { 
        _id: req.params.id,
        userId: req.userId  // 确保所有权
      },
      {
        name,
        breed,
        gender,
        birthDate,
        color,
        weight,
        isNeutered,
        photo: normalizedPhotos[0] || '',
        photos: normalizedPhotos,
        notes
      },
      { 
        new: true,          // 返回更新后的数据
        runValidators: true // 运行 schema 验证
      }
    );
    
    if (!cat) {
      return res.status(404).json({ message: '猫咪不存在' });
    }
    
    res.json({
      message: '更新成功',
      data: serializeCat(cat)
    });
  } catch (error) {
    console.error('更新猫咪错误:', error);
    res.status(500).json({ 
      message: '服务器错误', 
      error: error.message 
    });
  }
};

// 删除猫咪
exports.deleteCat = async (req, res) => {
  try {
    // 🔒 查找并删除（确保只能删除自己的猫）
    const cat = await Cat.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId  // 确保所有权
    });
    
    if (!cat) {
      return res.status(404).json({ message: '猫咪不存在' });
    }
    
    res.json({
      message: '删除成功'
    });
  } catch (error) {
    console.error('删除猫咪错误:', error);
    res.status(500).json({ 
      message: '服务器错误', 
      error: error.message 
    });
  }
};
