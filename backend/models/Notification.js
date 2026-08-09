const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    type: { type: String, enum: ['info', 'warning', 'success', 'error'], default: 'info' },
    targetType: {
      type: String,
      enum: ['all', 'branch', 'semester', 'student'],
      default: 'all',
    },
    targetValue: { type: String, default: '' }, // branch name, semester number, or student _id
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
