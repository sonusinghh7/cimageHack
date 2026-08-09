const Student = require('../models/Student');
const jwt = require('jsonwebtoken');
const { generateTokens, setTokenCookies, clearTokenCookies } = require('../utils/generateToken');

// @desc    Login student
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { studentId, password } = req.body;

    if (!studentId || !password) {
      return res.status(400).json({ success: false, message: 'Please provide student ID and password' });
    }

    const student = await Student.findOne({ studentId: studentId.trim() });

    if (!student || !(await student.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid Student ID or Password' });
    }

    if (!student.isActive) {
      return res.status(403).json({ success: false, message: 'Your account has been deactivated. Contact admin.' });
    }

    const { accessToken, refreshToken } = generateTokens(student._id);

    // Save refresh token in DB
    student.refreshToken = refreshToken;
    await student.save({ validateBeforeSave: false });

    setTokenCookies(res, accessToken, refreshToken);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      student: {
        _id: student._id,
        name: student.name,
        studentId: student.studentId,
        email: student.email,
        branch: student.branch,
        semester: student.semester,
        photo: student.photo,
        batch: student.batch,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public (requires refresh cookie)
const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({ success: false, message: 'No refresh token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const student = await Student.findById(decoded.id);

    if (!student || student.refreshToken !== token) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(student._id);
    student.refreshToken = newRefreshToken;
    await student.save({ validateBeforeSave: false });

    setTokenCookies(res, accessToken, newRefreshToken);

    res.status(200).json({ success: true, message: 'Token refreshed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res, next) => {
  try {
    const student = await Student.findById(req.student._id);
    if (student) {
      student.refreshToken = '';
      await student.save({ validateBeforeSave: false });
    }

    clearTokenCookies(res);
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged-in student (me)
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, student: req.student });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, refreshToken, logout, getMe };
