const Course = require('../models/Course');

// @desc    Get courses for logged-in student's semester & branch
// @route   GET /api/courses
// @access  Private
const getCourses = async (req, res, next) => {
  try {
    const { semester, branch } = req.student;
    const courses = await Course.find({ semester, branch }).sort('code');
    res.status(200).json({ success: true, count: courses.length, courses });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Private
const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.status(200).json({ success: true, course });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCourses, getCourseById };
