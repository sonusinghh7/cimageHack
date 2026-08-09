const express = require('express');
const router = express.Router();
const { getAttendance } = require('../controllers/attendance.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, getAttendance);

module.exports = router;
