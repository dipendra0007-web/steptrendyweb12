const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const MongooseCompat = require('./MongooseCompat');

const BlogModel = sequelize.define('Blog', {
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
  excerpt: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  coverImage: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  author: {
    type: DataTypes.STRING,
    defaultValue: 'StepTrendy Team'
  },
  authorAvatar: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  readTime: {
    type: DataTypes.INTEGER,
    defaultValue: 5
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  status: {
    type: DataTypes.ENUM('draft', 'published'),
    defaultValue: 'published'
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  metaTitle: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  metaDescription: {
    type: DataTypes.TEXT,
    defaultValue: ''
  }
}, {
  timestamps: true,
  hooks: {
    beforeValidate: (blog) => {
      if (blog.title && !blog.slug) {
        blog.slug = blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }
      if (blog.content && !blog.readTime) {
        const wordCount = blog.content.split(' ').length;
        blog.readTime = Math.ceil(wordCount / 200) || 1;
      }
    }
  }
});

module.exports = new MongooseCompat(BlogModel, 'Blog');
