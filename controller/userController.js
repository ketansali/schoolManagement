const mongoose = require("mongoose");
const errorResponse = require("../middleware/error-response");
const USER = mongoose.model("users");
const { decodeUris, cloneDeep } = require("../lib/commonQuery");
const {
  successResponse,
  badRequestResponse,
} = require("../middleware/response");
const path = require('path')
const fs = require('fs')
exports.user = {
  getImageOptions: function (req) {
    let pathDirectory = __dirname.split('\\')
    pathDirectory.pop()
    pathDirectory = pathDirectory.join('\\')
    const uploadedFile = req.files.image
    const extension = uploadedFile.name.split('.')[
      uploadedFile.name.split('.').length - 1
    ]
    const fileName = `${new Date().valueOf()}_${Math.ceil(
      Math.random() * 10000,
    )}.${extension}`
    const uploadFilePath = `${pathDirectory}/uploads/users/${fileName}`
    return {
      fileName,
      uploadFilePath,
      uploadedFile,
    }
  },
  addUser: async (req, res) => {
    try {
     
      const userInfo = await USER.findOne({
        email: req.body.email,
      });
      if (userInfo) {
        return badRequestResponse(res, {
          message: "Email already exist!",
        });
      }
      const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        contact: req.body.contact,
        country: req.body.country,
        state: req.body.state,
        city: req.body.city,
        address: req.body.address,
        isActive: true,
        departmentId: req.body.departmentId,
        DOB: req.body.DOB,
        DOJ: req.body.DOJ,
        degree: req.body.degree,
        userType: req.body.userType,
        courseId: req.body.courseId,
        createdBy: req.user._id,
      };
      if (req.files && Object.keys(req.files).length > 0) {
        const fileInfo = this.user.getImageOptions(req)
        const extensionName = path.extname(fileInfo.fileName); // fetch the file extension
        const allowedExtension = ['.png','.jpg','.jpeg'];
        if(!allowedExtension.includes(extensionName)){
          return badRequestResponse(res, {
            message: '!Invalid image',
          })
        }
        user.image = fileInfo.fileName
        fileInfo.uploadedFile.mv(fileInfo.uploadFilePath,async(err)=>{
          if (err)
            return badRequestResponse(res, {
              message: 'Failed to save file',
            })
        })
      }
      const isCreated = await USER.create(user);
      if (isCreated) {
        return successResponse(res, {
          message: "User created successfully",
        });
      } else {
        return badRequestResponse(res, {
          message: "Failed to create User",
        });
      }
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  updateUser: async (req, res) => {
    try {
  
      const userInfo = await USER.findOne({
        _id: req.body.id,
      });
      if (!userInfo) {
        return badRequestResponse(res, {
          message: "User not found",
        });
      }
      
      const user =  {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        contact: req.body.contact,
        country: req.body.country,
        state: req.body.state,
        city: req.body.city,
        address: req.body.address,
        isActive: true,
        departmentId: req.body.departmentId,
        DOB: req.body.DOB,
        DOJ: req.body.DOJ,
        degree: req.body.degree,
        userType: req.body.userType,
        courseId: req.body.courseId,
        updatedBy: req.user._id,
      }
      if (req.files && Object.keys(req.files).length > 0) {
        let pathDirectory = __dirname.split('\\')
        console.log(pathDirectory);
        pathDirectory.pop()
        pathDirectory = pathDirectory.join('\\')
        fs.unlink(`${pathDirectory}/uploads/users/${userInfo.image}`,(err=>console.log(err)))
        const fileInfo = this.user.getImageOptions(req)
        const extensionName = path.extname(fileInfo.fileName); 
        const allowedExtension = ['.png','.jpg','.jpeg'];
        if(!allowedExtension.includes(extensionName)){
          return badRequestResponse(res, {
            message: '!Invalid image',
          })
        }
        user.image = fileInfo.fileName
        fileInfo.uploadedFile.mv(fileInfo.uploadFilePath,async(err)=>{
          if (err)
            return badRequestResponse(res, {
              message: 'Failed to save file',
            })
        })
      }
      await USER.findOneAndUpdate(
        { _id: userInfo._id },
        {
          $set:user
        }
      );
      return successResponse(res, {
        message: "User updated successfully",
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  deleteUser: async (req, res) => {
    try {
      const userInfo = await USER.findOne({
        _id: req.query.id,
      }); 
      if (!userInfo) {
        return badRequestResponse(res, {
          message: "User not found",
        });
      }
      let pathDirectory = __dirname.split('\\')
      console.log(pathDirectory);
      pathDirectory.pop()
      pathDirectory = pathDirectory.join('\\')
     await fs.unlink(`${pathDirectory}/uploads/users/${userInfo.image}`,(err=>console.log(err)))
      await USER.findByIdAndRemove({
        _id: userInfo._id,
      });
      return successResponse(res, {
        message: "User deleted successfully",
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  getUsers: async (req, res) => {
    try {
      req.body = decodeUris(req.body);
      const populateQuery = [
        { path: "country", select: "countryName" },
        { path: "state", select: "stateName" },
        { path: "city", select: "cityName" },
        {path:'departmentId',select:'departmentName'},
        {path:'courseId',select:'courseName'},
      ];
      const users = await USER.find({}).populate(populateQuery)
      return successResponse(res, {
        data: cloneDeep(users),
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  getUserById: async (req, res) => {
    try {
      req.body = decodeUris(req.body);
      const userInfo = await USER.findOne({
        _id: req.query.id,
      });
      if (!userInfo) {
        return badRequestResponse(res, {
          message: "User not found",
        });
      }
      return successResponse(res, {
        data: cloneDeep(userInfo),
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
};
