const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    records: [
      {
        date: { type: Date, required: true },
        status: { type: String, enum: ['Present', 'Absent', 'Leave'], default: 'Absent' },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: calculate attendance percentage
attendanceSchema.virtual('percentage').get(function () {
  if (!this.records || this.records.length === 0) return 0;
  const present = this.records.filter((r) => r.status === 'Present').length;
  return Math.round((present / this.records.length) * 100);
});

attendanceSchema.virtual('totalClasses').get(function () {
  return this.records ? this.records.length : 0;
});

attendanceSchema.virtual('presentCount').get(function () {
  return this.records ? this.records.filter((r) => r.status === 'Present').length : 0;
});

module.exports = mongoose.model('Attendance', attendanceSchema);
