const express = require('express');
const router = express.Router();
const { getResults, getResultBySemester } = require('../controllers/result.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, getResults);
router.get('/:semester', protect, getResultBySemester);

module.exports = router;
