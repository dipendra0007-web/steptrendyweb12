const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const MongooseCompat = require('./MongooseCompat');

const PortfolioModel = sequelize.define('Portfolio', {
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
  category: {
    type: DataTypes.ENUM('web', 'mobile', 'ui-ux', 'branding', 'ai', 'software'),
    allowNull: false
  },
  client: {
    type: DataTypes.STRING,
    allowNull: false
  },
  technologies: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  shortDescription: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  coverImage: {
    type: DataTypes.STRING,
    allowNull: false
  },
  images: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  colorPalette: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  typography: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  liveUrl: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  githubUrl: {
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
  status: {
    type: DataTypes.ENUM('draft', 'published'),
    defaultValue: 'published'
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: []
  }
}, {
  timestamps: true,
  hooks: {
    beforeValidate: (portfolio) => {
      if (portfolio.title && !portfolio.slug) {
        portfolio.slug = portfolio.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }
    }
  }
});

module.exports = new MongooseCompat(PortfolioModel, 'Portfolio');
