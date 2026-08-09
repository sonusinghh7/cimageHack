const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: ['Exam', 'Holiday', 'Event', 'Academic', 'Fee', 'General'],
      default: 'General',
    },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },
    targetBranch: { type: String, default: 'All' }, // 'All' or specific branch
    targetSemester: { type: Number, default: 0 },   // 0 = all semesters
    attachmentUrl: { type: String, default: '' },
    postedBy: { type: String, default: 'Administration' },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notice', noticeSchema);
