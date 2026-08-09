const Notification = require('../models/Notification');
const Student = require('../models/Student');

// GET /api/admin/notifications
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find()
      .populate('createdBy', 'name username')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: notifications.length, notifications });
  } catch (err) { next(err); }
};

// POST /api/admin/notifications  (send)
const sendNotification = async (req, res, next) => {
  try {
    const { title, message, type, targetType, targetValue } = req.body;
    if (!title || !message) return res.status(400).json({ success: false, message: 'Title and message required' });

    const notification = await Notification.create({
      title, message, type, targetType, targetValue, createdBy: req.admin._id,
    });

    res.status(201).json({ success: true, message: 'Notification sent', notification });
  } catch (err) { next(err); }
};

// DELETE /api/admin/notifications/:id
const deleteNotification = async (req, res, next) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Notification deleted' });
  } catch (err) { next(err); }
};

// GET /api/notifications  (for STUDENTS — returns notifications relevant to them)
const getStudentNotifications = async (req, res, next) => {
  try {
    const { branch, semester, _id } = req.student;
    const notifications = await Notification.find({
      isActive: true,
      $or: [
        { targetType: 'all' },
        { targetType: 'branch', targetValue: branch },
        { targetType: 'semester', targetValue: String(semester) },
        { targetType: 'student', targetValue: String(_id) },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    res.status(200).json({ success: true, notifications });
  } catch (err) { next(err); }
};

module.exports = { getNotifications, sendNotification, deleteNotification, getStudentNotifications };
