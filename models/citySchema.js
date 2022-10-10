const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const citySchema = sequelize.define("City",{
    Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
    cityName : {
        type : DataTypes.STRING,
        allowNull: false
    },
    StateId :{
        type : DataTypes.INTEGER,
        allowNull: false
    },
    createdBy : {
        type : DataTypes.INTEGER
    },
    updatedBy : {
        type : DataTypes.INTEGER
    },
    isActive : {
        type : DataTypes.BOOLEAN,

    }
   
})
module.exports = citySchema

