const Student = require('../models/Student');

// GET /api/admin/students
const getAllStudents = async (req, res, next) => {
  try {
    const { search = '', branch, semester, status } = req.query;
    const filter = {};
    if (branch) filter.branch = branch;
    if (semester) filter.semester = Number(semester);
    if (status === 'active') filter.isActive = true;
    if (status === 'inactive') filter.isActive = false;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    const students = await Student.find(filter).select('-password -refreshToken').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: students.length, students });
  } catch (err) { next(err); }
};

// POST /api/admin/students
const createStudent = async (req, res, next) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Student created',
      student: { _id: student._id, name: student.name, studentId: student.studentId },
    });
  } catch (err) { next(err); }
};

// GET /api/admin/students/:id
const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id).select('-password -refreshToken');
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.status(200).json({ success: true, student });
  } catch (err) { next(err); }
};

// PUT /api/admin/students/:id
const updateStudent = async (req, res, next) => {
  try {
    const { password, refreshToken, ...safeFields } = req.body;
    const student = await Student.findByIdAndUpdate(req.params.id, safeFields, { new: true, runValidators: true })
      .select('-password -refreshToken');
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.status(200).json({ success: true, message: 'Student updated', student });
  } catch (err) { next(err); }
};

// DELETE /api/admin/students/:id
const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.status(200).json({ success: true, message: 'Student deleted' });
  } catch (err) { next(err); }
};

// PUT /api/admin/students/:id/toggle
const toggleStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    student.isActive = !student.isActive;
    await student.save({ validateBeforeSave: false });
    res.status(200).json({ success: true, message: `Account ${student.isActive ? 'activated' : 'deactivated'}`, isActive: student.isActive });
  } catch (err) { next(err); }
};

// PUT /api/admin/students/:id/reset-password
const resetStudentPassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6)
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    student.password = newPassword;
    await student.save();
    res.status(200).json({ success: true, message: 'Password reset successfully' });
  } catch (err) { next(err); }
};

module.exports = { getAllStudents, createStudent, getStudentById, updateStudent, deleteStudent, toggleStudent, resetStudentPassword };
