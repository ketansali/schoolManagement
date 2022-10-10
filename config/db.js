"use strict";
const Sequelize = require("sequelize");
const sequelize = new Sequelize("schoolmanagement", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging : false,
  query:{raw:true}
});
sequelize
  .authenticate()
  .then(() => {
     sequelize.sync({force:false})
    console.log("Connection established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  })
  
module.exports = sequelize