const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getAssignments, submitAssignment } = require('../controllers/assignment.controller');
const { protect } = require('../middleware/auth.middleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, `assignment_${Date.now()}_${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

router.get('/', protect, getAssignments);
router.post('/:id/submit', protect, upload.single('file'), submitAssignment);

module.exports = router;
