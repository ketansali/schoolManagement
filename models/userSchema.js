"use strict";
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;

const userSchema = sequelize.define("User", {
  Id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contact: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  CountryId : {
      type : DataTypes.INTEGER
  },
  StateId : {
      type : DataTypes.INTEGER
  },
  CityId : {
      type : DataTypes.INTEGER
  },
  address: {
    type: DataTypes.STRING,
  },
  image: {
    type: DataTypes.STRING,
  },
  role: {
    type: DataTypes.STRING,
  },
  DepartmentId : {
      type : DataTypes.INTEGER
  },
  DOB: {
    type: DataTypes.DATEONLY,
  },
  DOJ: {
    type: DataTypes.DATEONLY,
  },
  degree: {
    type: DataTypes.STRING,
  },
  createdBy: {
    type: DataTypes.INTEGER,
  },
  userType: {
    type: DataTypes.STRING,
  },
  updatedBy: {
    type: DataTypes.INTEGER,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
  },
  password: {
    type: DataTypes.STRING,
  },
});
function generateHash(user) {
  if (user === null) {
      throw new Error('No found user');
  }
  else if (!user.changed('password')) return user.password;
  else {
      let salt = bcrypt.genSaltSync();
      return user.password = bcrypt.hashSync(user.password, salt);
  }
}

userSchema.beforeCreate(generateHash);

userSchema.beforeUpdate(generateHash);

module.exports = userSchema;
