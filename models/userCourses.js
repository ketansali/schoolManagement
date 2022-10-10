const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/db");

const userCoursesSchema = sequelize.define("UserCourses", {
  Id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  UserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  CourseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  createdBy: {
    type: DataTypes.INTEGER,
  },
  updatedBy: {
    type: DataTypes.INTEGER,
  },
  
});
module.exports = userCoursesSchema;
