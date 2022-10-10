const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const departmentSchema = sequelize.define('Department',{
    Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
    departmentName : {
        type : DataTypes.STRING,
        allowNull: false
    },
    createdBy : {
        type : DataTypes.INTEGER
    },
    updatedBy : {
        type : DataTypes.INTEGER
    },
    isActive : {
        type : DataTypes.BOOLEAN
    }
   
},{timestamps:true})
module.exports = departmentSchema

