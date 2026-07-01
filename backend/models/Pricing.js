const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const MongooseCompat = require('./MongooseCompat');

const PricingModel = sequelize.define('Pricing', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.STRING,
    allowNull: false
  },
  currency: {
    type: DataTypes.ENUM('NPR', 'INR', 'USD'),
    defaultValue: 'INR'
  },
  period: {
    type: DataTypes.STRING,
    defaultValue: 'month'
  },
  tagline: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  features: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  color: {
    type: DataTypes.STRING,
    defaultValue: '#5B8CFF'
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: true
});

module.exports = new MongooseCompat(PricingModel, 'Pricing');
