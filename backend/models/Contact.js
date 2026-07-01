const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const MongooseCompat = require('./MongooseCompat');

const ContactModel = sequelize.define('Contact', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  company: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  budget: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  projectDetails: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('new', 'read', 'replied', 'closed'),
    defaultValue: 'new'
  },
  ipAddress: {
    type: DataTypes.STRING,
    defaultValue: ''
  }
}, {
  timestamps: true
});

module.exports = new MongooseCompat(ContactModel, 'Contact');
