// models/Pics.js

import { DataTypes } from 'sequelize';
import {sequelize} from '../sequelize.js'; // Adjust the path as necessary to your Sequelize instance

const Pics = sequelize.define('Pics', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Pics',
  timestamps: true // Automatically manages `createdAt` and `updatedAt` fields
});

export default Pics;