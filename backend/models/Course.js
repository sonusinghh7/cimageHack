const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    faculty: { type: String, required: true },
    facultyEmail: { type: String, default: '' },
    semester: { type: Number, required: true },
    branch: { type: String, required: true },
    credits: { type: Number, default: 4 },
    type: { type: String, enum: ['Theory', 'Practical', 'Lab'], default: 'Theory' },
    syllabus: [{ type: String }], // array of topic strings
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
