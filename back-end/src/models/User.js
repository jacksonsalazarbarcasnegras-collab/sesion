import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';

import sequelize from '../config/database.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombres: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apellidos: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  role: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 4,
    validate: {
      isIn: [[1, 2, 3, 4]],
    },
    references: {
      model: 'role',
      key: 'id',
    },
  },
  isActived: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
  tableName: 'users',
  timestamps: true,
  hooks: {
    async beforeCreate(user) {
      user.password = await bcrypt.hash(user.password, 12);
    },
    async beforeUpdate(user) {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    },
  },
});

User.prototype.checkPassword = function checkPassword(password) {
  return bcrypt.compare(password, this.password);
};

export default User;