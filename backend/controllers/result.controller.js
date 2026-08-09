const Result = require('../models/Result');

// @desc    Get all results for logged-in student
// @route   GET /api/results
// @access  Private
const getResults = async (req, res, next) => {
  try {
    const results = await Result.find({ student: req.student._id }).sort({ semester: -1 });

    res.status(200).json({
      success: true,
      count: results.length,
      results,
      latestCGPA: results.length > 0 ? results[0].cgpa : 0,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get result for specific semester
// @route   GET /api/results/:semester
// @access  Private
const getResultBySemester = async (req, res, next) => {
  try {
    const result = await Result.findOne({
      student: req.student._id,
      semester: parseInt(req.params.semester),
    });

    if (!result) {
      return res.status(404).json({ success: false, message: 'Result not found for this semester' });
    }

    res.status(200).json({ success: true, result });
  } catch (error) {
    next(error);
  }
};

module.exports = { getResults, getResultBySemester };
