const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

router.get('/health', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Mongo connection is not ready');
    }

    await mongoose.connection.db.admin().ping();
    res.status(200).json({ success: true, message: 'API is healthy' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database connection failed' });
  }
});

module.exports = router;
