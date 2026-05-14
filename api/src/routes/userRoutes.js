const express = require('express');
const { User } = require('../models');
const { toPublicUser } = require('../utils/serializers');

const router = express.Router();

router.get('/users/count', async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.status(200).json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: `Query error: ${error.message}` });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, users: users.map(toPublicUser) });
  } catch (error) {
    res.status(500).json({ success: false, message: `Query error: ${error.message}` });
  }
});

module.exports = router;
