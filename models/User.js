// models/Users.js

import { DataTypes } from 'sequelize';
import {sequelize} from '../sequelize.js'; // Adjust the path as necessary to your Sequelize instance

const Users = sequelize.define('Users', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
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
  tableName: 'Users',
  timestamps: true // Automatically manages `createdAt` and `updatedAt` fields
});

export default Users;