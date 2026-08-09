const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema(
  {
    semester: { type: Number, required: true },
    branch: { type: String, required: true },
    schedule: [
      {
        day: {
          type: String,
          enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          required: true,
        },
        periods: [
          {
            time: { type: String, required: true }, // e.g. "9:00 - 10:00"
            subject: { type: String, required: true },
            faculty: { type: String, default: '' },
            room: { type: String, default: '' },
            type: { type: String, enum: ['Theory', 'Practical', 'Lab', 'Break', 'Free'], default: 'Theory' },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Timetable', timetableSchema);
