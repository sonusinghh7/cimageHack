const Student = require('../models/Student');
const path = require('path');

// @desc    Get student profile
// @route   GET /api/student/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const student = await Student.findById(req.student._id).select('-password -refreshToken');
    res.status(200).json({ success: true, student });
  } catch (error) {
    next(error);
  }
};

// @desc    Update student profile
// @route   PUT /api/student/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { phone, address, guardianName, guardianPhone } = req.body;

    const student = await Student.findById(req.student._id);

    if (phone) student.phone = phone;
    if (address) student.address = address;
    if (guardianName) student.guardianName = guardianName;
    if (guardianPhone) student.guardianPhone = guardianPhone;

    // If photo was uploaded
    if (req.file) {
      student.photo = `/uploads/${req.file.filename}`;
    }

    await student.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      student: {
        _id: student._id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        address: student.address,
        guardianName: student.guardianName,
        guardianPhone: student.guardianPhone,
        photo: student.photo,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/student/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const student = await Student.findById(req.student._id);

    if (!(await student.matchPassword(currentPassword))) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    student.password = newPassword;
    await student.save();

    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, changePassword };
