const mongoose = require('mongoose');
const { createApp } = require('./src/app');
const { ensureDemoData } = require('./src/services/demoDataService');
const { PORT, MONGO_DB_NAME, MONGO_HEARTBEAT_MS, buildMongoUri } = require('./src/config/env');

async function startServer() {
  const mongoUri = buildMongoUri();

  if (!mongoUri) {
    throw new Error('MongoDB credentials are missing. Please configure api/.env.');
  }

  await mongoose.connect(mongoUri, {
    dbName: MONGO_DB_NAME,
    serverSelectionTimeoutMS: 15000,
    heartbeatFrequencyMS: MONGO_HEARTBEAT_MS,
  });

  const activeDb = mongoose.connection?.name || MONGO_DB_NAME;
  const activeHost = mongoose.connection?.host || 'unknown-host';
  console.log(`Successfully connected to MongoDB (${activeHost}/${activeDb})`);
  const seedResult = await ensureDemoData();
  if (
    seedResult.insertedUsers > 0 ||
    seedResult.insertedProducts > 0 ||
    seedResult.insertedConversations > 0 ||
    seedResult.insertedMessages > 0
  ) {
    console.log(
      `Demo seed completed: users=${seedResult.insertedUsers}, products=${seedResult.insertedProducts}, conversations=${seedResult.insertedConversations}, messages=${seedResult.insertedMessages}`
    );
  }

  const app = createApp();

  app.listen(PORT, () => {
    console.log(`CampusCart API running at http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
