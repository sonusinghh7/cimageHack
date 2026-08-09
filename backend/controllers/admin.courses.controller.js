const Course = require('../models/Course');

const getCourses = async (req, res, next) => {
  try {
    const { branch, semester } = req.query;
    const filter = {};
    if (branch) filter.branch = branch;
    if (semester) filter.semester = Number(semester);
    const courses = await Course.find(filter).sort({ branch: 1, semester: 1, code: 1 });
    res.status(200).json({ success: true, count: courses.length, courses });
  } catch (err) { next(err); }
};

const createCourse = async (req, res, next) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({ success: true, message: 'Course created', course });
  } catch (err) { next(err); }
};

const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.status(200).json({ success: true, message: 'Course updated', course });
  } catch (err) { next(err); }
};

const deleteCourse = async (req, res, next) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Course deleted' });
  } catch (err) { next(err); }
};

module.exports = { getCourses, createCourse, updateCourse, deleteCourse };
