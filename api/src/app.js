const express = require('express');
const cors = require('cors');

const { CORS_ORIGIN, REQUEST_BODY_LIMIT } = require('./config/env');
const healthRoutes = require('./routes/healthRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const messageRoutes = require('./routes/messageRoutes');
const authRoutes = require('./routes/authRoutes');
const utilityRoutes = require('./routes/utilityRoutes');
const { errorHandler } = require('./middleware/errorHandler');

function createApp() {
  const app = express();

  app.use(cors({ origin: CORS_ORIGIN === '*' ? true : CORS_ORIGIN }));
  app.use(express.json({ limit: REQUEST_BODY_LIMIT }));
  app.use(express.urlencoded({ extended: true, limit: REQUEST_BODY_LIMIT }));

  app.use('/api', healthRoutes);
  app.use('/api', productRoutes);
  app.use('/api', userRoutes);
  app.use('/api', adminRoutes);
  app.use('/api', messageRoutes);
  app.use('/api', authRoutes);
  app.use('/api', utilityRoutes);

  app.use(errorHandler);

  return app;
}

module.exports = {
  createApp,
};
