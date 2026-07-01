const { Sequelize } = require('sequelize');
const path = require('path');

let sequelize;

const dbUrl = process.env.DATABASE_URL || process.env.MONGO_URI || '';

const isPostgres = dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://');

if (isPostgres) {
  console.log('🔄 Attempting to connect to PostgreSQL...');
  sequelize = new Sequelize(dbUrl, {
    dialect: 'postgres',
    logging: false, // Set to console.log if you want to debug SQL queries
    dialectOptions: {
      ssl: dbUrl.includes('render.com') || dbUrl.includes('dpg-') ? {
        require: true,
        rejectUnauthorized: false
      } : false
    }
  });
} else {
  console.log('🔄 No PostgreSQL URL found. Using local SQLite database...');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', 'database.sqlite'),
    logging: false
  });
}

module.exports = sequelize;
