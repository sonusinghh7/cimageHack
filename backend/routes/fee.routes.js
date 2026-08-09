const express = require('express');
const router = express.Router();
const { getFeeDetails } = require('../controllers/fee.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, getFeeDetails);

module.exports = router;
