const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

const uploadDir = path.join(__dirname, '../../uploads/cats');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${req.userId}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    cb(new Error('只能上传图片文件'));
    return;
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

router.post('/cat-photo', authMiddleware, (req, res) => {
  upload.single('photo')(req, res, (error) => {
    if (error) {
      const message = error.code === 'LIMIT_FILE_SIZE'
        ? '图片不能超过 5MB'
        : error.message;
      return res.status(400).json({ message });
    }

    if (!req.file) {
      return res.status(400).json({ message: '请选择要上传的图片' });
    }

    res.status(201).json({
      message: '上传成功',
      data: {
        url: `/api/uploads/cats/${req.file.filename}`
      }
    });
  });
});

module.exports = router;
