const USER = require("../models/userSchema");
const USERCOURSES = require("../models/userCourses");
const COUNTRY = require("../models/countrySchema");
const STATE = require("../models/stateSchema");
const CITY = require("../models/citySchema");
const sequelize = require("../config/db");
const errorResponse = require("../middleware/error-response");
const {
  successResponse,
  badRequestResponse,
} = require("../middleware/response");
const path = require("path");
const fs = require("fs");
const { Sequelize, QueryTypes } = require("sequelize");
const { unlikeImage } = require("../middleware/removeImage");
exports.user = {
  getImageOptions: function (req) {
    let pathDirectory = __dirname.split("\\");
    pathDirectory.pop();
    pathDirectory = pathDirectory.join("\\");
    const uploadedFile = req.files.image;
    const extension =
      uploadedFile.name.split(".")[uploadedFile.name.split(".").length - 1];
    const fileName = `${new Date().valueOf()}_${Math.ceil(
      Math.random() * 10000
    )}.${extension}`;
    const uploadFilePath = `${pathDirectory}/uploads/users/${fileName}`;
    return {
      fileName,
      uploadFilePath,
      uploadedFile,
    };
  },
  addUser: async (req, res) => {
    try {
      const userInfo = await USER.findOne({
        where: {
          email: Sequelize.where(
            Sequelize.fn("LOWER", Sequelize.col("email")),
            "LIKE",
            "%" + req.body.email.toLowerCase() + "%"
          ),
        },
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
        CountryId: req.body.CountryId,
        StateId: req.body.StateId,
        CityId: req.body.CityId,
        address: req.body.address,
        isActive: true,
        departmentId: req.body.departmentId,
        DOB: req.body.DOB,
        DOJ: req.body.DOJ,
        degree: req.body.degree,
        userType: req.body.userType,
        createdBy: req.user.Id,
      };

      if (req.files && Object.keys(req.files).length > 0) {
        const fileInfo = this.user.getImageOptions(req);
        const extensionName = path.extname(fileInfo.fileName); // fetch the file extension
        const allowedExtension = [".png", ".jpg", ".jpeg"];
        if (!allowedExtension.includes(extensionName)) {
          return badRequestResponse(res, {
            message: "!Invalid image",
          });
        }

        user.image = fileInfo.fileName;
        fileInfo.uploadedFile.mv(fileInfo.uploadFilePath, async (err) => {
          if (err)
            return badRequestResponse(res, {
              message: "Failed to save file",
            });
        });
      }

      const isCreated = await USER.create(user);
      if (isCreated) {
        if (req.body.courseId.length != 0) {
          const courses = req.body.courseId.map((e) => {
            return {
              UserId: isCreated.Id,
              CourseId: e,
              createdBy: req.user.Id,
            };
          });
          await USERCOURSES.bulkCreate(courses);
        }
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
      const userInfo = await USER.findByPk(req.body.id);
      if (!userInfo) {
        return badRequestResponse(res, {
          message: "User not found",
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
        updatedBy: req.user._id,
      };
      if (req.files && Object.keys(req.files).length > 0) {
        unlikeImage(`/uploads/users/${userInfo.image}`)
        const fileInfo = this.user.getImageOptions(req);
        const extensionName = path.extname(fileInfo.fileName);
        const allowedExtension = [".png", ".jpg", ".jpeg"];
        if (!allowedExtension.includes(extensionName)) {
          return badRequestResponse(res, {
            message: "!Invalid image",
          });
        }
        user.image = fileInfo.fileName;
        fileInfo.uploadedFile.mv(fileInfo.uploadFilePath, async (err) => {
          if (err)
            return badRequestResponse(res, {
              message: "Failed to save file",
            });
        });
      }
      await USER.update(user, { where: { Id: userInfo.Id } });
      return successResponse(res, {
        message: "User updated successfully",
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  deleteUser: async (req, res) => {
    try {
      const userInfo = await USER.findByPk(req.query.id);
      if (!userInfo) {
        return badRequestResponse(res, {
          message: "User not found",
        });
      } 
      unlikeImage(`/uploads/users/${userInfo.image}`)
      await USER.destroy({
        where: { Id: req.query.id },
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
      const users = await sequelize.query(
        "select `us`.`Id`,`us`.`firstName`,`us`.`lastName`,`us`.`email`,`us`.`contact`,`us`.`image`,`cs`.`countryName`,`ss`.`stateName`,`ct`.`cityName`,`us`.`address`,`dp`.`departmentName`,`us`.`DOB`,`us`.`DOJ`,`us`.`degree`,`us`.`userType`,`us`.`isActive`  from `users` as `us` LEFT OUTER join `countries`  as `cs` ON `us`.`CountryId`=`cs`.`Id` LEFT OUTER join `states` as `ss`ON `us`.`CountryId`=`ss`.`Id` LEFT OUTER JOIN `cities` as `ct` ON `us`.`CityId`=`ct`.`Id` LEFT OUTER JOIN `departments` as `dp` ON `us`.`DepartmentId`=`dp`.`Id`",
        { type: QueryTypes.SELECT }
      );
      const usersCourses = await sequelize.query(
        "select `usc`.`UserId`,`usc`.`CourseId`,`cs`.`courseName` from `usercourses` as `usc` LEFT OUTER join `courses` as `cs` ON `usc`.`CourseId`= `cs`.`Id`",
        { type: QueryTypes.SELECT }
      );
      users.map((elm) => {
        usersCourses.map((e) => {
          if (elm.Id == e.UserId) {
            if (!elm["courseNames"]) elm["courseNames"] = new Array();
            elm.courseNames.push(e.courseName);
          }
        });
      });

      return successResponse(res, {
        data: users,
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  getUserById: async (req, res) => {
    try {
      const users = await sequelize.query(
        "select `us`.`Id`,`us`.`firstName`,`us`.`lastName`,`us`.`email`,`us`.`contact`,`cs`.`countryName`,`ss`.`stateName`,`ct`.`cityName`,`us`.`address`,`dp`.`departmentName`,`us`.`DOB`,`us`.`DOJ`,`us`.`degree`,`us`.`image`,`us`.`userType`,`us`.`isActive`  from `users` as `us` LEFT OUTER join `countries`  as `cs` ON `us`.`CountryId`=`cs`.`Id` LEFT OUTER join `states` as `ss`ON `us`.`CountryId`=`ss`.`Id` LEFT OUTER JOIN `cities` as `ct` ON `us`.`CityId`=`ct`.`Id` LEFT OUTER JOIN `departments` as `dp` ON `us`.`DepartmentId`=`dp`.`Id` where `us`.`Id` = :Id",
        { replacements: { Id: req.query.id }, type: QueryTypes.SELECT }
      );

      const usersCourses = await sequelize.query(
        "select `usc`.`UserId`,`usc`.`CourseId`,`cs`.`courseName` from `usercourses` as `usc` LEFT OUTER join `courses` as `cs` ON `usc`.`CourseId`= `cs`.`Id`",
        {
          type: QueryTypes.SELECT,
        }
      );
      users.map((elm) => {
        usersCourses.map((e) => {
          if (elm.Id == e.UserId) {
            if (!elm["courseNames"]) elm["courseNames"] = new Array();
            elm.courseNames.push(e.courseName);
          }
        });
      });
      if (!users) {
        return badRequestResponse(res, {
          message: "User not found",
        });
      }
      return successResponse(res, {
        data: users,
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
};
