const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const MongooseCompat = require('./MongooseCompat');

const TestimonialModel = sequelize.define('Testimonial', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false
  },
  avatar: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  rating: {
    type: DataTypes.INTEGER,
    defaultValue: 5
  },
  feedback: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  project: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  }
}, {
  timestamps: true
});

module.exports = new MongooseCompat(TestimonialModel, 'Testimonial');
