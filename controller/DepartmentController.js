
const errorResponse = require('../middleware/error-response')
const DEPARTMENT = require('../models/departmentSchema')
const { successResponse, badRequestResponse } = require('../middleware/response')
const { Sequelize,Op } = require("sequelize");
exports.department = {
    addDepartment : async  (req,res)=>{
        try {

            const departmentInfo = await DEPARTMENT.findOne({
              where: {
                departmentName: Sequelize.where(
                  Sequelize.fn("LOWER", Sequelize.col("departmentName")),
                  "LIKE",
                  "%" + req.body.departmentName.toLowerCase() + "%"
                ),
              }
              },);
              console.log(req.user);
              if (departmentInfo) {
                return badRequestResponse(res, {
                  message: "Department already exist!",
                });
              }
            const department = {
                departmentName: req.body.departmentName,
                createdBy: req.user.Id,
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

            const departmentInfo = await DEPARTMENT.findByPk(req.body.id)
            if (!departmentInfo) {
              return badRequestResponse(res, {
                message: 'Department not found',
              })
            }
            const nameExisted = await DEPARTMENT.findOne({
              where: { [Op.and]:{
                departmentName: Sequelize.where(
                  Sequelize.fn("LOWER", Sequelize.col('departmentName')),
                  "LIKE",
                  "%" + req.body.departmentName.toLowerCase() + "%"
                ),
                Id :{
                  [Op.ne]:req.body.id
                }
              }   
              },
            })
            if(nameExisted) return badRequestResponse(res,{
              message :'Department already exist!'
            })
            await DEPARTMENT.update(
              {
                  departmentName: req.body.departmentName,
                 updatedBy :req.user.Id
                
              },
              { where: { Id: departmentInfo.Id } }
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
            const departmentInfo = await DEPARTMENT.findByPk(req.query.id)
            if (!departmentInfo) {
              return badRequestResponse(res, {
                message: 'Department not found',
              })
            }
            await DEPARTMENT.destroy({
              where: { Id: req.query.id }
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

            const coutries = await DEPARTMENT.findAll({})
            return successResponse(res, {
              data: coutries
            })
          } catch (error) {
            return errorResponse(error, req, res)
          }
    },
    getDepartmentById : async  (req,res)=>{
        try {

            const departmentInfo = await DEPARTMENT.findByPk(req.query.id)
            if (!departmentInfo) {
              return badRequestResponse(res, {
                message: 'Department not found',
              })
            }
            return successResponse(res, {
              data: departmentInfo
            })
          } catch (error) {
            return errorResponse(error, req, res)
          }
         
    },
}
