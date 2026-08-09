const Assignment = require('../models/Assignment');

// @desc    Get assignments for logged-in student
// @route   GET /api/assignments
// @access  Private
const getAssignments = async (req, res, next) => {
  try {
    const { semester, branch, _id: studentId } = req.student;

    const assignments = await Assignment.find({ semester, branch })
      .populate('course', 'name code')
      .sort({ dueDate: 1 })
      .lean();

    // Attach submission status per assignment
    const enriched = assignments.map((a) => {
      const submission = a.submissions.find((s) => s.student.toString() === studentId.toString());
      return {
        _id: a._id,
        title: a.title,
        description: a.description,
        course: a.course,
        dueDate: a.dueDate,
        maxMarks: a.maxMarks,
        attachmentUrl: a.attachmentUrl,
        createdAt: a.createdAt,
        submitted: !!submission,
        submission: submission
          ? { fileUrl: submission.fileUrl, fileName: submission.fileName, submittedAt: submission.submittedAt, grade: submission.grade }
          : null,
        isOverdue: new Date(a.dueDate) < new Date() && !submission,
      };
    });

    res.status(200).json({ success: true, count: enriched.length, assignments: enriched });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit assignment
// @route   POST /api/assignments/:id/submit
// @access  Private
const submitAssignment = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    // Check if already submitted
    const alreadySubmitted = assignment.submissions.some(
      (s) => s.student.toString() === req.student._id.toString()
    );
    if (alreadySubmitted) {
      return res.status(400).json({ success: false, message: 'You have already submitted this assignment' });
    }

    assignment.submissions.push({
      student: req.student._id,
      fileUrl: `/uploads/${req.file.filename}`,
      fileName: req.file.originalname,
      submittedAt: new Date(),
    });

    await assignment.save();

    res.status(200).json({ success: true, message: 'Assignment submitted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAssignments, submitAssignment };
