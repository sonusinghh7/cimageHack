const express = require('express');
const router = express.Router();
const { protectAdmin } = require('../middleware/adminAuth.middleware');
const { adminLogin, adminLogout, adminMe } = require('../controllers/admin.auth.controller');
const { getStats } = require('../controllers/admin.stats.controller');
const { getAllStudents, createStudent, getStudentById, updateStudent, deleteStudent, toggleStudent, resetStudentPassword } = require('../controllers/admin.students.controller');
const { getCourses, createCourse, updateCourse, deleteCourse } = require('../controllers/admin.courses.controller');
const { getNotifications, sendNotification, deleteNotification } = require('../controllers/admin.notifications.controller');
const {
  getAttendanceOverview,
  getAllFees, addFeeRecord,
  getAllResults, addResult,
  getAllAssignments, createAssignment, deleteAssignment,
  getTimetableAdmin, createTimetableAdmin,
} = require('../controllers/admin.general.controller');

// ---- Auth ----
router.post('/login', adminLogin);
router.post('/logout', protectAdmin, adminLogout);
router.get('/me', protectAdmin, adminMe);

// ---- Stats ----
router.get('/stats', protectAdmin, getStats);

// ---- Students ----
router.get('/students', protectAdmin, getAllStudents);
router.post('/students', protectAdmin, createStudent);
router.get('/students/:id', protectAdmin, getStudentById);
router.put('/students/:id', protectAdmin, updateStudent);
router.delete('/students/:id', protectAdmin, deleteStudent);
router.put('/students/:id/toggle', protectAdmin, toggleStudent);
router.put('/students/:id/reset-password', protectAdmin, resetStudentPassword);

// ---- Courses ----
router.get('/courses', protectAdmin, getCourses);
router.post('/courses', protectAdmin, createCourse);
router.put('/courses/:id', protectAdmin, updateCourse);
router.delete('/courses/:id', protectAdmin, deleteCourse);

// ---- Notifications ----
router.get('/notifications', protectAdmin, getNotifications);
router.post('/notifications', protectAdmin, sendNotification);
router.delete('/notifications/:id', protectAdmin, deleteNotification);

// ---- Attendance ----
router.get('/attendance', protectAdmin, getAttendanceOverview);

// ---- Fees ----
router.get('/fees', protectAdmin, getAllFees);
router.post('/fees/:studentId', protectAdmin, addFeeRecord);

// ---- Results ----
router.get('/results', protectAdmin, getAllResults);
router.post('/results', protectAdmin, addResult);

// ---- Assignments ----
router.get('/assignments', protectAdmin, getAllAssignments);
router.post('/assignments', protectAdmin, createAssignment);
router.delete('/assignments/:id', protectAdmin, deleteAssignment);

// ---- Timetable ----
router.get('/timetable', protectAdmin, getTimetableAdmin);
router.post('/timetable', protectAdmin, createTimetableAdmin);

module.exports = router;
