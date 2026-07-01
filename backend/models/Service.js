const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const MongooseCompat = require('./MongooseCompat');

const ServiceModel = sequelize.define('Service', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    unique: true
  },
  icon: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  shortDescription: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  features: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  technologies: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  price: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  duration: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  }
}, {
  timestamps: true,
  hooks: {
    beforeValidate: (service) => {
      if (service.title && !service.slug) {
        service.slug = service.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
      }
    }
  }
});

module.exports = new MongooseCompat(ServiceModel, 'Service');
