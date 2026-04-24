const express = require('express');
const multer = require('multer');
const authMiddleware = require('../middleware/auth.middleware');
const cloudinary = require('../config/cloudinary');

const router = express.Router();

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    cb(new Error('只能上传图片文件'));
    return;
  }

  cb(null, true);
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

const uploadBufferToCloudinary = (file, userId) => new Promise((resolve, reject) => {
  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: `cat-manager/${userId}`,
      resource_type: 'image'
    },
    (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(result);
    }
  );

  uploadStream.end(file.buffer);
});

router.post('/cat-photo', authMiddleware, (req, res) => {
  upload.single('photo')(req, res, async (error) => {
    if (error) {
      const message = error.code === 'LIMIT_FILE_SIZE'
        ? '图片不能超过 5MB'
        : error.message;
      return res.status(400).json({ message });
    }

    if (!req.file) {
      return res.status(400).json({ message: '请选择要上传的图片' });
    }

    try {
      const result = await uploadBufferToCloudinary(req.file, req.userId);

      res.status(201).json({
        message: '上传成功',
        data: {
          url: result.secure_url
        }
      });
    } catch (uploadError) {
      console.error('Cloudinary 上传失败:', uploadError);
      res.status(500).json({ message: '图片上传失败，请稍后重试' });
    }
  });
});

module.exports = router;
