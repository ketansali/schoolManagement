const errorResponse = require("../middleware/error-response")
const mongoose = require('mongoose');
const { successResponse, badRequestResponse, notFoundResponse } = require("../middleware/response");
const { decodeUris, cloneDeep } = require("../lib/commonQuery");
const USER = mongoose.model("users");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


exports.account = {

    login: async (req,res)=>{
        try {
            req.body = decodeUris(req.body);
            let userInfo = await USER.findOne({
              email: req.body.email,
            });
            if (userInfo) {
              if (!bcrypt.compareSync(req.body.password, userInfo.password)) {
                return badRequestResponse(res, {
                  message: "Authentication failed. Wrong password.",
                });
              }
              
              userInfo = cloneDeep(userInfo);
              delete userInfo["password"];
              // create a token
              const token = jwt.sign(userInfo, process.env.secret, {
                expiresIn: "24h", // expires in 24 hours
              });
              return successResponse(res, {
                message: "You are logged in successfully!",
                token,
                userInfo,
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
              email: req.body.email,
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