const express = require('express');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { ensureDemoUsers, insertSampleProducts } = require('../services/demoDataService');

const router = express.Router();

router.post('/seed-products', async (req, res) => {
  try {
    const insertedUsers = await ensureDemoUsers();
    const { inserted, errors } = await insertSampleProducts(true);

    return res.status(200).json({
      success: true,
      inserted,
      insertedUsers,
      errors,
      message: `Inserted ${inserted} sample products`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Seed failed: ${error.message}` });
  }
});

router.post('/reset-passwords', async (req, res) => {
  try {
    const hash = await bcrypt.hash('password123', 10);
    const result = await User.updateMany({}, { $set: { password: hash } });

    return res.status(200).json({
      success: true,
      updatedUsers: Number(result.modifiedCount || 0),
      message: `Updated ${Number(result.modifiedCount || 0)} users with password123`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Error: ${error.message}` });
  }
});

module.exports = router;
