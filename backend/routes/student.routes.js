const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getProfile, updateProfile, changePassword } = require('../controllers/student.controller');
const { protect } = require('../middleware/auth.middleware');

// Multer config for photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, `photo_${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } }); // 2MB

router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.single('photo'), updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;
