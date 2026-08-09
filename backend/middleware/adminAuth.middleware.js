const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protectAdmin = async (req, res, next) => {
  try {
    const token = req.cookies?.adminAccessToken;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized — admin only' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select('-password -refreshToken');

    if (!admin) return res.status(401).json({ success: false, message: 'Admin not found' });
    if (!admin.isActive) return res.status(403).json({ success: false, message: 'Admin account deactivated' });

    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ success: false, message: 'Invalid admin token' });
  }
};

module.exports = { protectAdmin };
