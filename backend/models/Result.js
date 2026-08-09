const mongoose = require('mongoose');

const subjectMarkSchema = new mongoose.Schema({
  subjectCode: { type: String, required: true },
  subjectName: { type: String, required: true },
  internal: { type: Number, default: 0 },
  external: { type: Number, default: 0 },
  maxInternal: { type: Number, default: 30 },
  maxExternal: { type: Number, default: 70 },
  grade: { type: String, default: '' },
  credits: { type: Number, default: 4 },
});

const resultSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    semester: { type: Number, required: true },
    examType: { type: String, enum: ['Mid-Sem', 'End-Sem', 'Supplementary'], default: 'End-Sem' },
    subjects: [subjectMarkSchema],
    gpa: { type: Number, default: 0 },
    cgpa: { type: Number, default: 0 },
    result: { type: String, enum: ['Pass', 'Fail', 'Detained', 'Withheld'], default: 'Pass' },
    declaredOn: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Result', resultSchema);
