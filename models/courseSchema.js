const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const courseSchema = sequelize.define('Course',{
    Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
    courseName : {
        type : DataTypes.STRING,
        allowNull: false
    },
    startDate : {
        type : DataTypes.DATEONLY,
        allowNull: false
    },
    endDate : {
        type : DataTypes.DATEONLY,
        allowNull: false
    },
    description : {
        type : DataTypes.STRING,
        allowNull: false
    },
    createdBy : {
        type : DataTypes.INTEGER
    },
    updatedBy : {
        type :DataTypes.INTEGER
    },
    isActive : {
        type : DataTypes.BOOLEAN
    }
   
})
module.exports = courseSchema

