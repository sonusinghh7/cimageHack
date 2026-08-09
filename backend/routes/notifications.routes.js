const express = require('express');
const router = express.Router();
const { getStudentNotifications } = require('../controllers/admin.notifications.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, getStudentNotifications);

module.exports = router;
