const express = require('express');
const router = express.Router();
const { getCourses, getCourseById } = require('../controllers/course.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, getCourses);
router.get('/:id', protect, getCourseById);

module.exports = router;
