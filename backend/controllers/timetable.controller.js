const Timetable = require('../models/Timetable');

// @desc    Get timetable for logged-in student
// @route   GET /api/timetable
// @access  Private
const getTimetable = async (req, res, next) => {
  try {
    const { semester, branch } = req.student;
    const timetable = await Timetable.findOne({ semester, branch });

    if (!timetable) {
      return res.status(404).json({ success: false, message: 'Timetable not found for your semester/branch' });
    }

    res.status(200).json({ success: true, timetable });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTimetable };
