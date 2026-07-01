const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const MongooseCompat = require('./MongooseCompat');

const TimelineModel = sequelize.define('Timeline', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  year: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  desc: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: true
});

module.exports = new MongooseCompat(TimelineModel, 'Timeline');
