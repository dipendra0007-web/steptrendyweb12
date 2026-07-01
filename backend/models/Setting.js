const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const MongooseCompat = require('./MongooseCompat');

const SettingModel = sequelize.define('Setting', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  websiteName: {
    type: DataTypes.STRING,
    defaultValue: 'StepTrendy Technologies'
  },
  logo: {
    type: DataTypes.STRING,
    defaultValue: '/logo.png'
  },
  favicon: {
    type: DataTypes.STRING,
    defaultValue: '/favicon.ico'
  },
  copyrightText: {
    type: DataTypes.STRING,
    defaultValue: '© 2026 StepTrendy Technologies Pvt. Ltd. All rights reserved.'
  },
  emails: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  phoneNumbers: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  addresses: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  whatsapp: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  workingHours: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  socials: {
    type: DataTypes.JSON,
    defaultValue: []
  }
}, {
  timestamps: true
});

module.exports = new MongooseCompat(SettingModel, 'Setting');
