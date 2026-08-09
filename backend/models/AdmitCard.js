const mongoose = require('mongoose');

const examSubjectSchema = new mongoose.Schema({
  subjectCode: { type: String, required: true },
  subjectName: { type: String, required: true },
  examDate: { type: Date, required: true },
  examTime: { type: String, default: '10:00 AM - 1:00 PM' },
  duration: { type: String, default: '3 Hours' },
  maxMarks: { type: Number, default: 100 },
});

const admitCardSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    semester: { type: Number, required: true },
    examType: { type: String, enum: ['Mid-Sem', 'End-Sem', 'Supplementary'], default: 'End-Sem' },
    academicYear: { type: String, required: true },
    examCenter: { type: String, default: 'Cimage Group of Institutions, Patna' },
    examCenterCode: { type: String, default: 'CIM-01' },
    subjects: [examSubjectSchema],
    isEligible: { type: Boolean, default: true },
    ineligibilityReason: { type: String, default: '' },
    issueDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AdmitCard', admitCardSchema);
