const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const MongooseCompat = require('./MongooseCompat');

const CareerModel = sequelize.define('Career', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    defaultValue: 'Remote / Surat, India'
  },
  type: {
    type: DataTypes.ENUM('full-time', 'part-time', 'internship', 'contract'),
    defaultValue: 'full-time'
  },
  experience: {
    type: DataTypes.STRING,
    allowNull: false
  },
  salary: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  requirements: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  responsibilities: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  skills: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  benefits: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  status: {
    type: DataTypes.ENUM('open', 'closed'),
    defaultValue: 'open'
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true
});

const ApplicationModel = sequelize.define('Application', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  job: {
    type: DataTypes.STRING,
    allowNull: false
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
    allowNull: false
  },
  coverLetter: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  resumeUrl: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  portfolioUrl: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  linkedinUrl: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  status: {
    type: DataTypes.ENUM('pending', 'reviewed', 'shortlisted', 'rejected', 'hired'),
    defaultValue: 'pending'
  }
}, {
  timestamps: true
});

module.exports = {
  Career: new MongooseCompat(CareerModel, 'Career'),
  Application: new MongooseCompat(ApplicationModel, 'Application')
};
