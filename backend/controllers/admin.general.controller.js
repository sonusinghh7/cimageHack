const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Fee = require('../models/Fee');
const Result = require('../models/Result');
const Assignment = require('../models/Assignment');
const Timetable = require('../models/Timetable');

// GET /api/admin/attendance — overview of all students' attendance
const getAttendanceOverview = async (req, res, next) => {
  try {
    const { branch, semester } = req.query;
    const studentFilter = {};
    if (branch) studentFilter.branch = branch;
    if (semester) studentFilter.semester = Number(semester);

    const students = await Student.find(studentFilter).select('name studentId branch semester').lean();
    const studentIds = students.map((s) => s._id);

    const allAttendance = await Attendance.find({ student: { $in: studentIds } })
      .populate('course', 'name code')
      .lean();

    const result = students.map((student) => {
      const recs = allAttendance.filter((a) => a.student.toString() === student._id.toString());
      const totalPresent = recs.reduce((s, a) => s + a.records.filter((r) => r.status === 'Present').length, 0);
      const totalClasses = recs.reduce((s, a) => s + a.records.length, 0);
      const percentage = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;
      return { student, totalPresent, totalClasses, percentage, status: percentage >= 75 ? 'Safe' : percentage >= 60 ? 'Warning' : 'Critical' };
    });

    res.status(200).json({ success: true, attendance: result });
  } catch (err) { next(err); }
};

// GET /api/admin/fees
const getAllFees = async (req, res, next) => {
  try {
    const fees = await Fee.find()
      .populate('student', 'name studentId branch semester')
      .sort({ createdAt: -1 })
      .lean({ virtuals: true });

    const totalDue = fees.reduce((sum, f) => {
      const paid = f.payments.reduce((s, p) => s + p.amount, 0);
      return sum + Math.max(0, f.totalFee - paid);
    }, 0);

    res.status(200).json({ success: true, count: fees.length, fees, totalDue });
  } catch (err) { next(err); }
};

// POST /api/admin/fees/:studentId
const addFeeRecord = async (req, res, next) => {
  try {
    const fee = await Fee.create({ student: req.params.studentId, ...req.body });
    res.status(201).json({ success: true, message: 'Fee record created', fee });
  } catch (err) { next(err); }
};

// GET /api/admin/results
const getAllResults = async (req, res, next) => {
  try {
    const results = await Result.find()
      .populate('student', 'name studentId branch')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: results.length, results });
  } catch (err) { next(err); }
};

// POST /api/admin/results
const addResult = async (req, res, next) => {
  try {
    const result = await Result.create(req.body);
    res.status(201).json({ success: true, message: 'Result added', result });
  } catch (err) { next(err); }
};

// GET /api/admin/assignments
const getAllAssignments = async (req, res, next) => {
  try {
    const assignments = await Assignment.find()
      .populate('course', 'name code')
      .sort({ dueDate: -1 });
    res.status(200).json({ success: true, count: assignments.length, assignments });
  } catch (err) { next(err); }
};

// POST /api/admin/assignments
const createAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.create(req.body);
    res.status(201).json({ success: true, message: 'Assignment created', assignment });
  } catch (err) { next(err); }
};

// DELETE /api/admin/assignments/:id
const deleteAssignment = async (req, res, next) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Assignment deleted' });
  } catch (err) { next(err); }
};

// GET /api/admin/timetable
const getTimetableAdmin = async (req, res, next) => {
  try {
    const { branch, semester } = req.query;
    const filter = {};
    if (branch) filter.branch = branch;
    if (semester) filter.semester = Number(semester);
    const timetables = await Timetable.find(filter);
    res.status(200).json({ success: true, timetables });
  } catch (err) { next(err); }
};

// POST /api/admin/timetable
const createTimetableAdmin = async (req, res, next) => {
  try {
    const { semester, branch } = req.body;
    await Timetable.deleteOne({ semester, branch });
    const timetable = await Timetable.create(req.body);
    res.status(201).json({ success: true, message: 'Timetable saved', timetable });
  } catch (err) { next(err); }
};

module.exports = {
  getAttendanceOverview,
  getAllFees, addFeeRecord,
  getAllResults, addResult,
  getAllAssignments, createAssignment, deleteAssignment,
  getTimetableAdmin, createTimetableAdmin,
};
