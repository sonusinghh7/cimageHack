const express = require('express');
const router = express.Router();
const { getAdmitCard } = require('../controllers/admitcard.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, getAdmitCard);

module.exports = router;
