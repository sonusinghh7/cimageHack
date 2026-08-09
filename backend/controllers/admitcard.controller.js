const AdmitCard = require('../models/AdmitCard');

// @desc    Get admit card for logged-in student
// @route   GET /api/admitcard
// @access  Private
const getAdmitCard = async (req, res, next) => {
  try {
    const admitCard = await AdmitCard.findOne({ student: req.student._id })
      .sort({ createdAt: -1 })
      .populate('student', 'name studentId branch semester batch gender photo');

    if (!admitCard) {
      return res.status(404).json({ success: false, message: 'Admit card not found. Contact admin.' });
    }

    res.status(200).json({ success: true, admitCard });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAdmitCard };
