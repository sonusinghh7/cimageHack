const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Fee = require('../models/Fee');
const Assignment = require('../models/Assignment');
const Course = require('../models/Course');
const Notification = require('../models/Notification');

// GET /api/admin/stats
const getStats = async (req, res, next) => {
  try {
    const [totalStudents, activeStudents, totalCourses, allAttendance, allFees, allAssignments, recentNotifications] =
      await Promise.all([
        Student.countDocuments(),
        Student.countDocuments({ isActive: true }),
        Course.countDocuments(),
        Attendance.find().lean({ virtuals: true }),
        Fee.find().lean({ virtuals: true }),
        Assignment.find().lean(),
        Notification.find({ isActive: true }).sort({ createdAt: -1 }).limit(5).lean(),
      ]);

    // Students below 75% attendance
    const studentAttMap = {};
    allAttendance.forEach((a) => {
      const id = a.student.toString();
      if (!studentAttMap[id]) studentAttMap[id] = { present: 0, total: 0 };
      a.records.forEach((r) => {
        studentAttMap[id].total++;
        if (r.status === 'Present') studentAttMap[id].present++;
      });
    });
    const lowAttendanceCount = Object.values(studentAttMap).filter(
      (s) => s.total > 0 && (s.present / s.total) * 100 < 75
    ).length;

    // Total fee dues
    const totalDue = allFees.reduce((sum, f) => {
      const paid = f.payments.reduce((s, p) => s + p.amount, 0);
      return sum + Math.max(0, f.totalFee - paid);
    }, 0);

    // Pending assignment submissions (assignments with no submissions)
    const pendingAssignments = allAssignments.filter((a) => a.submissions.length === 0).length;

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        activeStudents,
        inactiveStudents: totalStudents - activeStudents,
        totalCourses,
        lowAttendanceCount,
        totalDue,
        pendingAssignments,
        recentNotifications,
      },
    });
  } catch (err) { next(err); }
};

module.exports = { getStats };
