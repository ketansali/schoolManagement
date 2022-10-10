
const errorResponse = require('../middleware/error-response')
const COURSE = require('../models/courseSchema')
const { successResponse, badRequestResponse } = require('../middleware/response')
const { Sequelize,Op } = require("sequelize");
exports.course = {
    addCourse : async  (req,res)=>{
        try {
  
            const courseInfo = await COURSE.findOne({
              where: {
                courseName: Sequelize.where(
                  Sequelize.fn("LOWER", Sequelize.col("courseName")),
                  "LIKE",
                  "%" + req.body.courseName.toLowerCase() + "%"
                ),
              },
              },);
              if (courseInfo) {
                return badRequestResponse(res, {
                  message: "Course already exist!",
                });
              }
            
            const course = {
                courseName: req.body.courseName,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                description: req.body.description,
                createdBy: req.user.Id,
                isActive: true
            }

            const isCreated = await COURSE.create(course)
            if (isCreated) {
              return successResponse(res, {
                message: 'Course created successfully',
              })
            } else {
              return badRequestResponse(res, {
                message: 'Failed to create Course',
              })
            }
          } catch (error) {
            return errorResponse(error, req, res)
          }
         
    },
    updateCourse : async  (req,res)=>{
        try {

            const courseInfo = await COURSE.findByPk(req.body.id)
            if (!courseInfo) {
              return badRequestResponse(res, {
                message: 'Course not found',
              })
            }
            const nameExisted = await COURSE.findOne({
              where: { [Op.and]:{
                courseName: Sequelize.where(
                  Sequelize.fn("LOWER", Sequelize.col('courseName')),
                  "LIKE",
                  "%" + req.body.courseName.toLowerCase() + "%"
                ),
                Id :{
                  [Op.ne]:req.body.id
                }
              }   
              },
            })
            if(nameExisted) return badRequestResponse(res,{
              message :'Course already exist!'
            })
            await COURSE.update(
              { 
                    courseName: req.body.courseName,
                    startDate: req.body.startDate,
                    endDate: req.body.endDate,
                    description: req.body.description,
                    updatedBy :req.user.Id
                },
              { where: { Id: courseInfo.Id } }
            )
            return successResponse(res, {
              message: 'Course updated successfully',
            })
          } catch (error) {
            return errorResponse(error, req, res)
          } 
    },
    deleteCourse : async  (req,res)=>{
        try {
            const courseInfo = await COURSE.findByPk(req.query.id)
            if (!courseInfo) {
              return badRequestResponse(res, {
                message: 'Course not found',
              })
            }
            await COURSE.destroy({
              where: { Id: req.query.id },
            })
            return successResponse(res, {
              message: 'Course deleted successfully',
            })
          } catch (error) {
            return errorResponse(error, req, res)
          } 
    },
    getCourses : async  (req,res)=>{
        try {

            const coutries = await COURSE.findAll({})
            return successResponse(res, {
              data: coutries
            })
          } catch (error) {
            return errorResponse(error, req, res)
          }
    },
    getCourseById : async  (req,res)=>{
        try {

            const courseInfo = await COURSE.findByPk(req.query.id)
            if (!courseInfo) {
              return badRequestResponse(res, {
                message: 'Course not found',
              })
            }
            return successResponse(res, {
              data: courseInfo
            })
          } catch (error) {
            return errorResponse(error, req, res)
          }
         
    },
}
