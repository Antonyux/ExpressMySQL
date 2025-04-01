const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Role = require('./role');


const User = sequelize.define('Users', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  roleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Role,
      key: 'id'
    }
  },
  email_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  phone_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  joiningDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  dob: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'deleted', 'inactive', 'not_verified'),
    defaultValue: 'not_verified'
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  otp: {
      type: DataTypes.STRING,
      allowNull: true
  },
  otpExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true
  },
  last_signed_in_at: {
      type: DataTypes.DATE,
      allowNull: true
  },
  verification_token: {
      type: DataTypes.STRING,
      allowNull: true
  }

}, {
  timestamps: true
});

module.exports = User;
