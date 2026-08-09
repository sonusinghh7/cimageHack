const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  fileUrl: { type: String, required: true },
  fileName: { type: String, default: '' },
  submittedAt: { type: Date, default: Date.now },
  remarks: { type: String, default: '' },
  grade: { type: String, default: '' },
});

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    dueDate: { type: Date, required: true },
    maxMarks: { type: Number, default: 10 },
    attachmentUrl: { type: String, default: '' },
    semester: { type: Number, required: true },
    branch: { type: String, required: true },
    submissions: [submissionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Assignment', assignmentSchema);
