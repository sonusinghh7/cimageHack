const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

const setAdminCookies = (res, accessToken) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('adminAccessToken', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: 8 * 60 * 60 * 1000, // 8 hours
  });
};

// POST /api/admin/login
const adminLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ success: false, message: 'Provide username and password' });

    const admin = await Admin.findOne({ username: username.trim().toLowerCase() });
    if (!admin || !(await admin.matchPassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    if (!admin.isActive)
      return res.status(403).json({ success: false, message: 'Account deactivated' });

    const accessToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '8h' });
    setAdminCookies(res, accessToken);

    res.status(200).json({
      success: true,
      admin: { _id: admin._id, name: admin.name, username: admin.username, role: admin.role },
    });
  } catch (err) { next(err); }
};

// POST /api/admin/logout
const adminLogout = (req, res) => {
  res.cookie('adminAccessToken', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ success: true, message: 'Logged out' });
};

// GET /api/admin/me
const adminMe = (req, res) => {
  res.status(200).json({ success: true, admin: req.admin });
};

module.exports = { adminLogin, adminLogout, adminMe };
