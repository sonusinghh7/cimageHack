const Fee = require('../models/Fee');

// @desc    Get fee details for logged-in student
// @route   GET /api/fee
// @access  Private
const getFeeDetails = async (req, res, next) => {
  try {
    const fees = await Fee.find({ student: req.student._id })
      .sort({ semester: -1 })
      .lean({ virtuals: true });

    const totalDue = fees.reduce((sum, f) => {
      const paid = f.payments.reduce((s, p) => s + p.amount, 0);
      return sum + Math.max(0, f.totalFee - paid);
    }, 0);

    res.status(200).json({ success: true, fees, totalDue });
  } catch (error) {
    next(error);
  }
};

module.exports = { getFeeDetails };
