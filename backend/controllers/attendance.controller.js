const Attendance = require('../models/Attendance');

// @desc    Get attendance summary for logged-in student
// @route   GET /api/attendance
// @access  Private
const getAttendance = async (req, res, next) => {
  try {
    const attendanceRecords = await Attendance.find({ student: req.student._id })
      .populate('course', 'name code faculty type')
      .lean({ virtuals: true });

    const summary = attendanceRecords.map((rec) => {
      const present = rec.records.filter((r) => r.status === 'Present').length;
      const total = rec.records.length;
      const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
      return {
        _id: rec._id,
        course: rec.course,
        totalClasses: total,
        presentCount: present,
        percentage,
        status: percentage >= 75 ? 'Safe' : percentage >= 60 ? 'Warning' : 'Critical',
        records: rec.records.map((r) => ({ date: r.date, status: r.status })),
      };
    });

    const overallPresent = attendanceRecords.reduce(
      (sum, r) => sum + r.records.filter((x) => x.status === 'Present').length,
      0
    );
    const overallTotal = attendanceRecords.reduce((sum, r) => sum + r.records.length, 0);
    const overallPercentage = overallTotal > 0 ? Math.round((overallPresent / overallTotal) * 100) : 0;

    res.status(200).json({
      success: true,
      overallPercentage,
      overallPresent,
      overallTotal,
      attendance: summary,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAttendance };
