const sequelize = require('./sequelize');
const { seedDatabase } = require('./seeder');

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`✅ Database connection established successfully.`);
    
    // Sync models to database
    // use alter: true or force: false so it doesn't overwrite existing tables if we rerun
    await sequelize.sync({ alter: true });
    console.log(`✅ Database models synchronized.`);
    
    // Seed initial data
    await seedDatabase();
  } catch (error) {
    console.error(`❌ Database connection/sync failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
