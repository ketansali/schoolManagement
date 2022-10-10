const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/db");

const eventImagesSchema = sequelize.define("EventImages", {
  Id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  EventId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdBy: {
    type: DataTypes.INTEGER,
  },
  updatedBy: {
    type: DataTypes.INTEGER,
  },
  
});
module.exports = eventImagesSchema;
