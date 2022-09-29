const mongoose = require('mongoose')
const errorResponse = require('../middleware/error-response')
const COURSE = mongoose.model('course')
const {decodeUris, cloneDeep}  = require('../lib/commonQuery')
const { successResponse, badRequestResponse } = require('../middleware/response')

exports.course = {
    addCourse : async  (req,res)=>{
        try {
            req.body = decodeUris(req.body)
            const courseInfo = await COURSE.findOne({
                courseName: {$regex : req.body.courseName, $options:'i'},
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
                createdBy: req.user._id,
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
            req.body = decodeUris(req.body)
            const courseInfo = await COURSE.findOne({
              _id: req.body.id,
            })
            if (!courseInfo) {
              return badRequestResponse(res, {
                message: 'Course not found',
              })
            }
            await COURSE.findOneAndUpdate(
              { _id: courseInfo._id },
              {
                $set: {
                    courseName: req.body.courseName,
                    startDate: req.body.startDate,
                    endDate: req.body.endDate,
                    description: req.body.description,
                    updatedBy :req.user._id
                },
              },
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
            const courseInfo = await COURSE.findOne({
              _id: req.query.id,
            })
            if (!courseInfo) {
              return badRequestResponse(res, {
                message: 'Course not found',
              })
            }
            await COURSE.findByIdAndRemove({
              _id: courseInfo._id,
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
            req.body = decodeUris(req.body)
            const coutries = await COURSE.find({})
            return successResponse(res, {
              data: cloneDeep(coutries),
            })
          } catch (error) {
            return errorResponse(error, req, res)
          }
    },
    getCourseById : async  (req,res)=>{
        try {
            req.body = decodeUris(req.body)
            const courseInfo = await COURSE.findOne({
              _id: req.query.id,
            })
            if (!courseInfo) {
              return badRequestResponse(res, {
                message: 'Course not found',
              })
            }
            return successResponse(res, {
              data: cloneDeep(courseInfo),
            })
          } catch (error) {
            return errorResponse(error, req, res)
          }
         
    },
}
