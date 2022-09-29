const mongoose = require('mongoose')
const errorResponse = require('../middleware/error-response')
const DEPARTMENT = mongoose.model('department')
const {decodeUris, cloneDeep}  = require('../lib/commonQuery')
const { successResponse, badRequestResponse } = require('../middleware/response')

exports.department = {
    addDepartment : async  (req,res)=>{
        try {
            req.body = decodeUris(req.body)
            const departmentInfo = await DEPARTMENT.findOne({
                departmentName: {$regex : req.body.departmentName, $options:'i'},
              },);
              if (departmentInfo) {
                return badRequestResponse(res, {
                  message: "Department already exist!",
                });
              }
            
            const department = {
                departmentName: req.body.departmentName,
                createdBy: req.user._id,
                isActive: true
            }

            const isCreated = await DEPARTMENT.create(department)
            if (isCreated) {
              return successResponse(res, {
                message: 'Department created successfully',
              })
            } else {
              return badRequestResponse(res, {
                message: 'Failed to create Department',
              })
            }
          } catch (error) {
            return errorResponse(error, req, res)
          }
         
    },
    updateDepartment : async  (req,res)=>{
        try {
            req.body = decodeUris(req.body)
            const departmentInfo = await DEPARTMENT.findOne({
              _id: req.body.id,
            })
            if (!departmentInfo) {
              return badRequestResponse(res, {
                message: 'Department not found',
              })
            }
            await DEPARTMENT.findOneAndUpdate(
              { _id: departmentInfo._id },
              {
                $set: {
                  departmentName: req.body.departmentName,
                 updatedBy :req.user._id
                },
              },
            )
            return successResponse(res, {
              message: 'Department updated successfully',
            })
          } catch (error) {
            return errorResponse(error, req, res)
          } 
    },
    deleteDepartment : async  (req,res)=>{
        try {
            const departmentInfo = await DEPARTMENT.findOne({
              _id: req.query.id,
            })
            if (!departmentInfo) {
              return badRequestResponse(res, {
                message: 'Department not found',
              })
            }
            await DEPARTMENT.findByIdAndRemove({
              _id: departmentInfo._id,
            })
            return successResponse(res, {
              message: 'Department deleted successfully',
            })
          } catch (error) {
            return errorResponse(error, req, res)
          } 
    },
    getDepartments : async  (req,res)=>{
        try {
            req.body = decodeUris(req.body)
            const coutries = await DEPARTMENT.find({})
            return successResponse(res, {
              data: cloneDeep(coutries),
            })
          } catch (error) {
            return errorResponse(error, req, res)
          }
    },
    getDepartmentById : async  (req,res)=>{
        try {
            req.body = decodeUris(req.body)
            const departmentInfo = await DEPARTMENT.findOne({
              _id: req.query.id,
            })
            if (!departmentInfo) {
              return badRequestResponse(res, {
                message: 'Department not found',
              })
            }
            return successResponse(res, {
              data: cloneDeep(departmentInfo),
            })
          } catch (error) {
            return errorResponse(error, req, res)
          }
         
    },
}
