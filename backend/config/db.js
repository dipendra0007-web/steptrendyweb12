const mongoose = require('mongoose');
const { seedDatabase } = require('./seeder');

let mongoServer;

const connectDB = async () => {
  try {
    // Try connecting with a short timeout so it doesn't hang forever if local DB is down
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    await seedDatabase();
  } catch (error) {
    console.warn(`⚠️ Local MongoDB connection failed: ${error.message}`);
    console.log(`🔄 Attempting to start in-memory MongoDB server...`);
    try {
      // Set MongoDB version to 5.0.26 (much smaller download size than 7.x/8.x)
      process.env.MONGOMS_VERSION = '5.0.26';
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      
      const conn = await mongoose.connect(mongoUri);
      console.log(`✅ In-Memory MongoDB Connected: ${conn.connection.host}`);
      await seedDatabase();
    } catch (memError) {
      console.error(`❌ Failed to start In-Memory MongoDB: ${memError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
