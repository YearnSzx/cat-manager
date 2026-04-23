const express = require('express');
const router = express.Router();
const { 
  getCats, 
  getCatById, 
  createCat, 
  updateCat, 
  deleteCat 
} = require('../controllers/cat.controller');
const authMiddleware = require('../middleware/auth.middleware');

// 🔒 所有猫咪路由都需要登录认证
router.use(authMiddleware);

// 获取猫咪列表
router.get('/', getCats);

// 获取单个猫咪
router.get('/:id', getCatById);

// 创建猫咪
router.post('/', createCat);

// 更新猫咪
router.put('/:id', updateCat);

// 删除猫咪
router.delete('/:id', deleteCat);

module.exports = router;
