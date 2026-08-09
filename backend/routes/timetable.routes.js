const express = require('express');
const router = express.Router();
const { getTimetable } = require('../controllers/timetable.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, getTimetable);

module.exports = router;
