// models/Captions.js

import { DataTypes } from 'sequelize';
import {sequelize} from '../sequelize.js'; // Adjust the path as necessary to your Sequelize instance

const Captions = sequelize.define('Captions', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  pic_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Pics',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  caption: {
    type: DataTypes.TEXT
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
  tableName: 'Captions',
  timestamps: true // Automatically manages `createdAt` and `updatedAt` fields
});

export default Captions;