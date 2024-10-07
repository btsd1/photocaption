import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../sequelize.js';

class Users extends Model {}

Users.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'Users'
});

export default Users;