const express = require('express');
const { User } = require('../models');
const { requireAdminUser } = require('../utils/admin');
const { getUserApprovalStatus, toPublicUser } = require('../utils/serializers');

const router = express.Router();

router.get('/admin/pending-student-requests', async (req, res) => {
  const adminId = Number(req.query.adminId);

  if (!Number.isInteger(adminId) || adminId <= 0) {
    return res.status(400).json({ success: false, message: 'Valid adminId query parameter is required' });
  }

  try {
    const adminUser = await requireAdminUser(adminId);
    if (!adminUser) {
      return res.status(403).json({ success: false, message: 'Only admin users can access pending requests' });
    }

    const pendingUsers = await User.find({ role: 'student', approvalStatus: 'pending' })
      .sort({ approvalRequestedAt: 1, createdAt: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      pendingRequests: pendingUsers.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        requestedAt: user.approvalRequestedAt || user.createdAt,
      })),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Query error: ${error.message}` });
  }
});

router.post('/admin/pending-student-requests/:studentId/approve', async (req, res) => {
  const adminId = Number(req.body?.adminId);
  const studentId = Number(req.params.studentId);

  if (!Number.isInteger(adminId) || adminId <= 0) {
    return res.status(400).json({ success: false, message: 'Valid adminId is required' });
  }

  if (!Number.isInteger(studentId) || studentId <= 0) {
    return res.status(400).json({ success: false, message: 'Valid studentId is required' });
  }

  try {
    const adminUser = await requireAdminUser(adminId);
    if (!adminUser) {
      return res.status(403).json({ success: false, message: 'Only admin users can approve students' });
    }

    const student = await User.findOne({ id: studentId, role: 'student' });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student account not found' });
    }

    if (getUserApprovalStatus(student) === 'approved') {
      return res.status(200).json({
        success: true,
        message: 'Student account is already approved',
        user: toPublicUser(student),
      });
    }

    student.approvalStatus = 'approved';
    student.approvedAt = new Date();
    student.approvedBy = adminId;
    await student.save();

    return res.status(200).json({
      success: true,
      message: 'Student signup request approved',
      user: toPublicUser(student),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Approve failed: ${error.message}` });
  }
});

router.post('/admin/pending-student-requests/:studentId/reject', async (req, res) => {
  const adminId = Number(req.body?.adminId);
  const studentId = Number(req.params.studentId);

  if (!Number.isInteger(adminId) || adminId <= 0) {
    return res.status(400).json({ success: false, message: 'Valid adminId is required' });
  }

  if (!Number.isInteger(studentId) || studentId <= 0) {
    return res.status(400).json({ success: false, message: 'Valid studentId is required' });
  }

  try {
    const adminUser = await requireAdminUser(adminId);
    if (!adminUser) {
      return res.status(403).json({ success: false, message: 'Only admin users can reject students' });
    }

    const student = await User.findOne({ id: studentId, role: 'student' });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student account not found' });
    }

    student.approvalStatus = 'rejected';
    student.approvedAt = null;
    student.approvedBy = adminId;
    await student.save();

    return res.status(200).json({
      success: true,
      message: 'Student signup request rejected',
      user: toPublicUser(student),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Reject failed: ${error.message}` });
  }
});

module.exports = router;
