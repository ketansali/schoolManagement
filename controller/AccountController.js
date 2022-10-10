const errorResponse = require("../middleware/error-response")
const { successResponse, badRequestResponse, notFoundResponse } = require("../middleware/response");
const USER = require('../models/userSchema')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { Sequelize,Op } = require("sequelize");

exports.account = {

    login: async (req,res)=>{
        try {

            let userInfo = await USER.findOne({
              where: {
                email: Sequelize.where(
                  Sequelize.fn("LOWER", Sequelize.col("email")),
                  "LIKE",
                  "%" + req.body.email.toLowerCase() + "%"
                ),
              },
              raw: true
            });
            if (userInfo) {
              if (!bcrypt.compareSync(req.body.password, userInfo.password)) {
                
                return badRequestResponse(res, {
                  message: "Authentication failed. Wrong password.",
                });
              }
              
              userInfo = {
                Id: userInfo.Id,
                firstName : userInfo.firstName,
                lastName : userInfo.lastName,
                email : userInfo.email,
                contact : userInfo.contact,
                role : userInfo.role
              }
             // delete userInfo["password"];
              // create a token
              const token = await jwt.sign(userInfo, process.env.secret, {
                expiresIn: "24h", // expires in 24 hours
              });
              return successResponse(res, {
                message: "You are logged in successfully!",
                token,
                data :userInfo
              });
            }
            return notFoundResponse(res, {
              message: "Email not found!",
            });
          } catch (error) {
            return errorResponse(error, req, res);
          }
    },
    register: async(req, res)=>{
        try {
            const userInfo = await USER.findOne({
              where: {
                email: Sequelize.where(
                  Sequelize.fn("LOWER", Sequelize.col("email")),
                  "LIKE",
                  "%" + req.body.email.toLowerCase() + "%"
                ),
              }
            });
            if (userInfo) {
              return badRequestResponse(res, {
                message: "Email already exist!",
              });
            }
            if (req.body.password !== req.body.confirmPassword) {
              return badRequestResponse(res, {
                message: "Password and Confirm Password must be same",
              });
            }
            const user = {
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              email: req.body.email,
              contact: req.body.contact,
              isActive: true,
              password: req.body.password,
              role :'admin'
            };
            
              const isCreated = await USER.create(user);
              if (isCreated)
                return successResponse(res, {
                  message: "User created!",
                });
              else
                return badRequestResponse(res, {
                  message: "Failed to create user",
                });
            
          } catch (error) {
            return errorResponse(error, req, res);
          }
    }
}