/**
 * CimageConnect — Seed Script
 * Run: node seed/seed.js
 * Seeds a demo student with all associated data for testing.
 * Credentials: studentId: CIM2024001 | password: password123
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');

const Student = require('../models/Student');
const Course = require('../models/Course');
const Attendance = require('../models/Attendance');
const Assignment = require('../models/Assignment');
const Result = require('../models/Result');
const Fee = require('../models/Fee');
const Timetable = require('../models/Timetable');
const AdmitCard = require('../models/AdmitCard');

const connectDB = require('../config/db');

const seed = async () => {
  await connectDB();
  console.log('🌱 Starting seed...\n');

  // Cleanup
  await Promise.all([
    Student.deleteMany({}),
    Course.deleteMany({}),
    Attendance.deleteMany({}),
    Assignment.deleteMany({}),
    Result.deleteMany({}),
    Fee.deleteMany({}),
    Timetable.deleteMany({}),
    AdmitCard.deleteMany({}),
  ]);
  console.log('🗑  Cleared existing data');

  // ---- Student ----
  const student = await Student.create({
    studentId: 'CIM2024001',
    name: 'Sonu Singh',
    email: 'sonu.singh@cimage.in',
    password: 'password123',
    phone: '+91-9876543210',
    branch: 'CSE',
    semester: 5,
    batch: '2022-2026',
    gender: 'Male',
    category: 'General',
    dob: new Date('2003-06-15'),
    address: 'Patna, Bihar',
    guardianName: 'Rajesh Singh',
    guardianPhone: '+91-9123456789',
    isActive: true,
  });
  console.log(`✅ Student created: ${student.studentId} / password123`);

  // ---- Courses ----
  const courseDefs = [
    { code: 'CS501', name: 'Theory of Computation', faculty: 'Dr. Amit Kumar', credits: 4, type: 'Theory' },
    { code: 'CS502', name: 'Operating Systems', faculty: 'Dr. Priya Sharma', credits: 4, type: 'Theory' },
    { code: 'CS503', name: 'Computer Networks', faculty: 'Prof. Ravi Gupta', credits: 3, type: 'Theory' },
    { code: 'CS504', name: 'Database Management', faculty: 'Dr. Meena Patel', credits: 4, type: 'Theory' },
    { code: 'CS505', name: 'Software Engineering', faculty: 'Prof. Sunil Verma', credits: 3, type: 'Theory' },
    { code: 'CS506L', name: 'OS & Networks Lab', faculty: 'Prof. Ravi Gupta', credits: 2, type: 'Lab' },
  ];
  const courses = await Course.insertMany(
    courseDefs.map((c) => ({ ...c, semester: 5, branch: 'CSE', description: `${c.name} – Semester 5, CSE` }))
  );
  console.log(`✅ ${courses.length} courses created`);

  // ---- Attendance ----
  const generateRecords = (total, presentCount) => {
    const records = [];
    const start = new Date('2025-07-01');
    for (let i = 0; i < total; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      records.push({ date, status: i < presentCount ? 'Present' : 'Absent' });
    }
    return records;
  };

  const attendanceData = [
    { course: courses[0]._id, total: 40, present: 34 },
    { course: courses[1]._id, total: 38, present: 28 },
    { course: courses[2]._id, total: 35, present: 30 },
    { course: courses[3]._id, total: 42, present: 40 },
    { course: courses[4]._id, total: 36, present: 22 },
    { course: courses[5]._id, total: 20, present: 18 },
  ];
  await Attendance.insertMany(
    attendanceData.map((a) => ({
      student: student._id,
      course: a.course,
      records: generateRecords(a.total, a.present),
    }))
  );
  console.log('✅ Attendance records created');

  // ---- Assignments ----
  const now = new Date();
  await Assignment.insertMany([
    {
      title: 'TOC — DFA Construction',
      description: 'Design a DFA for the language L = {w | w ends with 01}. Submit a PDF report with state diagram.',
      course: courses[0]._id,
      semester: 5,
      branch: 'CSE',
      dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days later
      maxMarks: 20,
    },
    {
      title: 'OS — Process Scheduling Algorithms',
      description: 'Implement FCFS, SJF, and Round Robin scheduling algorithms in C. Submit source code and output.',
      course: courses[1]._id,
      semester: 5,
      branch: 'CSE',
      dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days later
      maxMarks: 25,
      submissions: [
        {
          student: student._id,
          fileUrl: '/uploads/dummy_submission.pdf',
          fileName: 'sonu_os_scheduling.pdf',
          submittedAt: new Date(),
          grade: 'A',
        },
      ],
    },
    {
      title: 'CN — Subnetting Practice',
      description: 'Given a Class C network, divide it into 8 subnets. Show subnet mask and valid host ranges.',
      course: courses[2]._id,
      semester: 5,
      branch: 'CSE',
      dueDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago (overdue)
      maxMarks: 15,
    },
    {
      title: 'DBMS — ER Diagram & Normalization',
      description: 'Design an ER diagram for a Hospital Management System and normalize up to 3NF.',
      course: courses[3]._id,
      semester: 5,
      branch: 'CSE',
      dueDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
      maxMarks: 30,
    },
  ]);
  console.log('✅ Assignments created');

  // ---- Result (Semester 4) ----
  await Result.create({
    student: student._id,
    semester: 4,
    examType: 'End-Sem',
    gpa: 8.2,
    cgpa: 8.1,
    result: 'Pass',
    declaredOn: new Date('2025-06-10'),
    subjects: [
      { subjectCode: 'CS401', subjectName: 'Design & Analysis of Algorithms', internal: 26, external: 60, maxInternal: 30, maxExternal: 70, grade: 'A', credits: 4 },
      { subjectCode: 'CS402', subjectName: 'Computer Organization', internal: 24, external: 55, maxInternal: 30, maxExternal: 70, grade: 'B+', credits: 4 },
      { subjectCode: 'CS403', subjectName: 'Discrete Mathematics', internal: 28, external: 65, maxInternal: 30, maxExternal: 70, grade: 'A+', credits: 3 },
      { subjectCode: 'CS404', subjectName: 'Web Technologies', internal: 25, external: 58, maxInternal: 30, maxExternal: 70, grade: 'A', credits: 3 },
      { subjectCode: 'CS405', subjectName: 'Python Programming', internal: 29, external: 68, maxInternal: 30, maxExternal: 70, grade: 'O', credits: 4 },
      { subjectCode: 'CS406L', subjectName: 'Web Dev Lab', internal: 28, external: 60, maxInternal: 30, maxExternal: 70, grade: 'A+', credits: 2 },
    ],
  });
  console.log('✅ Result (Sem 4) created');

  // ---- Fee ----
  await Fee.insertMany([
    {
      student: student._id,
      semester: 4,
      academicYear: '2024-25',
      totalFee: 45000,
      dueDate: new Date('2025-01-15'),
      feeBreakdown: { tuitionFee: 35000, examFee: 3000, libraryFee: 1000, developmentFee: 4000, otherFee: 2000 },
      payments: [
        { amount: 45000, paidOn: new Date('2025-01-10'), mode: 'Online', transactionId: 'TXN2025010001', receiptNo: 'REC-4001' },
      ],
    },
    {
      student: student._id,
      semester: 5,
      academicYear: '2025-26',
      totalFee: 47000,
      dueDate: new Date('2025-08-15'),
      feeBreakdown: { tuitionFee: 36000, examFee: 3500, libraryFee: 1000, developmentFee: 4500, otherFee: 2000 },
      payments: [
        { amount: 25000, paidOn: new Date('2025-07-20'), mode: 'Online', transactionId: 'TXN2025072001', receiptNo: 'REC-5001' },
      ],
    },
  ]);
  console.log('✅ Fee records created');

  // ---- Timetable ----
  await Timetable.create({
    semester: 5,
    branch: 'CSE',
    schedule: [
      {
        day: 'Monday',
        periods: [
          { time: '9:00 - 10:00', subject: 'Theory of Computation', faculty: 'Dr. Amit Kumar', room: 'A-201', type: 'Theory' },
          { time: '10:00 - 11:00', subject: 'Operating Systems', faculty: 'Dr. Priya Sharma', room: 'A-202', type: 'Theory' },
          { time: '11:00 - 12:00', subject: 'Computer Networks', faculty: 'Prof. Ravi Gupta', room: 'A-203', type: 'Theory' },
          { time: '12:00 - 1:00', subject: 'Lunch Break', faculty: '', room: '', type: 'Break' },
          { time: '1:00 - 2:00', subject: 'Database Management', faculty: 'Dr. Meena Patel', room: 'A-204', type: 'Theory' },
          { time: '2:00 - 3:00', subject: 'Software Engineering', faculty: 'Prof. Sunil Verma', room: 'A-201', type: 'Theory' },
        ],
      },
      {
        day: 'Tuesday',
        periods: [
          { time: '9:00 - 10:00', subject: 'Database Management', faculty: 'Dr. Meena Patel', room: 'A-204', type: 'Theory' },
          { time: '10:00 - 11:00', subject: 'Theory of Computation', faculty: 'Dr. Amit Kumar', room: 'A-201', type: 'Theory' },
          { time: '11:00 - 1:00', subject: 'OS & Networks Lab', faculty: 'Prof. Ravi Gupta', room: 'Lab-101', type: 'Lab' },
          { time: '1:00 - 2:00', subject: 'Lunch Break', faculty: '', room: '', type: 'Break' },
          { time: '2:00 - 3:00', subject: 'Computer Networks', faculty: 'Prof. Ravi Gupta', room: 'A-203', type: 'Theory' },
          { time: '3:00 - 4:00', subject: 'Free Period', faculty: '', room: '', type: 'Free' },
        ],
      },
      {
        day: 'Wednesday',
        periods: [
          { time: '9:00 - 10:00', subject: 'Operating Systems', faculty: 'Dr. Priya Sharma', room: 'A-202', type: 'Theory' },
          { time: '10:00 - 11:00', subject: 'Software Engineering', faculty: 'Prof. Sunil Verma', room: 'A-201', type: 'Theory' },
          { time: '11:00 - 12:00', subject: 'Computer Networks', faculty: 'Prof. Ravi Gupta', room: 'A-203', type: 'Theory' },
          { time: '12:00 - 1:00', subject: 'Lunch Break', faculty: '', room: '', type: 'Break' },
          { time: '1:00 - 3:00', subject: 'OS & Networks Lab', faculty: 'Prof. Ravi Gupta', room: 'Lab-101', type: 'Lab' },
          { time: '3:00 - 4:00', subject: 'Theory of Computation', faculty: 'Dr. Amit Kumar', room: 'A-201', type: 'Theory' },
        ],
      },
      {
        day: 'Thursday',
        periods: [
          { time: '9:00 - 10:00', subject: 'Database Management', faculty: 'Dr. Meena Patel', room: 'A-204', type: 'Theory' },
          { time: '10:00 - 11:00', subject: 'Operating Systems', faculty: 'Dr. Priya Sharma', room: 'A-202', type: 'Theory' },
          { time: '11:00 - 12:00', subject: 'Software Engineering', faculty: 'Prof. Sunil Verma', room: 'A-201', type: 'Theory' },
          { time: '12:00 - 1:00', subject: 'Lunch Break', faculty: '', room: '', type: 'Break' },
          { time: '1:00 - 2:00', subject: 'Theory of Computation', faculty: 'Dr. Amit Kumar', room: 'A-201', type: 'Theory' },
          { time: '2:00 - 3:00', subject: 'Free Period', faculty: '', room: '', type: 'Free' },
        ],
      },
      {
        day: 'Friday',
        periods: [
          { time: '9:00 - 10:00', subject: 'Computer Networks', faculty: 'Prof. Ravi Gupta', room: 'A-203', type: 'Theory' },
          { time: '10:00 - 11:00', subject: 'Database Management', faculty: 'Dr. Meena Patel', room: 'A-204', type: 'Theory' },
          { time: '11:00 - 12:00', subject: 'Operating Systems', faculty: 'Dr. Priya Sharma', room: 'A-202', type: 'Theory' },
          { time: '12:00 - 1:00', subject: 'Lunch Break', faculty: '', room: '', type: 'Break' },
          { time: '1:00 - 2:00', subject: 'Software Engineering', faculty: 'Prof. Sunil Verma', room: 'A-201', type: 'Theory' },
          { time: '2:00 - 3:00', subject: 'Theory of Computation', faculty: 'Dr. Amit Kumar', room: 'A-201', type: 'Theory' },
        ],
      },
      {
        day: 'Saturday',
        periods: [
          { time: '9:00 - 11:00', subject: 'OS & Networks Lab', faculty: 'Prof. Ravi Gupta', room: 'Lab-101', type: 'Lab' },
          { time: '11:00 - 12:00', subject: 'Database Management', faculty: 'Dr. Meena Patel', room: 'A-204', type: 'Theory' },
          { time: '12:00 - 1:00', subject: 'Lunch Break', faculty: '', room: '', type: 'Break' },
        ],
      },
    ],
  });
  console.log('✅ Timetable created');

  // ---- Admit Card ----
  await AdmitCard.create({
    student: student._id,
    semester: 5,
    examType: 'End-Sem',
    academicYear: '2025-26',
    examCenter: 'Cimage Group of Institutions, Anisabad, Patna',
    examCenterCode: 'CIM-01',
    isEligible: true,
    issueDate: new Date('2025-10-01'),
    subjects: [
      { subjectCode: 'CS501', subjectName: 'Theory of Computation', examDate: new Date('2025-11-10'), examTime: '10:00 AM - 1:00 PM', duration: '3 Hours', maxMarks: 70 },
      { subjectCode: 'CS502', subjectName: 'Operating Systems', examDate: new Date('2025-11-12'), examTime: '10:00 AM - 1:00 PM', duration: '3 Hours', maxMarks: 70 },
      { subjectCode: 'CS503', subjectName: 'Computer Networks', examDate: new Date('2025-11-14'), examTime: '10:00 AM - 1:00 PM', duration: '3 Hours', maxMarks: 70 },
      { subjectCode: 'CS504', subjectName: 'Database Management', examDate: new Date('2025-11-17'), examTime: '10:00 AM - 1:00 PM', duration: '3 Hours', maxMarks: 70 },
      { subjectCode: 'CS505', subjectName: 'Software Engineering', examDate: new Date('2025-11-19'), examTime: '10:00 AM - 1:00 PM', duration: '3 Hours', maxMarks: 70 },
      { subjectCode: 'CS506L', subjectName: 'OS & Networks Lab', examDate: new Date('2025-11-21'), examTime: '9:00 AM - 12:00 PM', duration: '3 Hours', maxMarks: 50 },
    ],
  });
  console.log('✅ Admit Card created');

  console.log('\n🎉 Seed complete!');
  console.log('   Login with → studentId: CIM2024001 | password: password123\n');
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
