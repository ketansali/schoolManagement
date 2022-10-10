const errorResponse = require('../middleware/error-response')
const STATE = require('../models/stateSchema')
const { successResponse, badRequestResponse } = require('../middleware/response')
const { Sequelize,Op } = require("sequelize");
exports.state = {
    addState : async  (req,res)=>{
        try {
            const stateInfo = await STATE.findOne({
              where: {
                stateName: Sequelize.where(
                  Sequelize.fn("LOWER", Sequelize.col("stateName")),
                  "LIKE",
                  "%" + req.body.stateName.toLowerCase() + "%"
                ),
              }
              },);
              if (stateInfo) {
                return badRequestResponse(res, {
                  message: "State already exist!",
                });
              }
            const state = {
                stateName: req.body.stateName,
                createdBy: req.user.Id,
                CountryId :req.body.CountryId,
                isActive: true
            }

            const isCreated = await STATE.create(state)
            if (isCreated) {
              return successResponse(res, {
                message: 'State created successfully',
              })
            } else {
              return badRequestResponse(res, {
                message: 'Failed to create State',
              })
            }
          } catch (error) {
            return errorResponse(error, req, res)
          }
         
    },
    updateState : async  (req,res)=>{
        try {
            const stateInfo = await STATE.findByPk(req.body.id)
            if (!stateInfo) {
              return badRequestResponse(res, {
                message: 'State not found',
              })
            }
            const nameExisted = await STATE.findOne({
              where: { [Op.and]:{
                stateName: Sequelize.where(
                  Sequelize.fn("LOWER", Sequelize.col('stateName')),
                  "LIKE",
                  "%" + req.body.stateName.toLowerCase() + "%"
                ),
                Id :{
                  [Op.ne]:req.body.id
                }
              }   
              },
            })
            if(nameExisted) return badRequestResponse(res,{
              message :'State already exist!'
            })
            await STATE.update(
              {
                  stateName: req.body.stateName,
                 updatedBy :req.user.Id,
                  countryId :req.body.countryId              
              },
              {where : {Id :stateInfo.Id }}
            )
            return successResponse(res, {
              message: 'State updated successfully',
            })
          } catch (error) {
            return errorResponse(error, req, res)
          } 
    },
    deleteState : async  (req,res)=>{
        try {
            const stateInfo = await STATE.findByPk(req.query.id)
            if (!stateInfo) {
              return badRequestResponse(res, {
                message: 'State not found',
              })
            }
            await STATE.destroy({
              where: { Id: req.query.id },
            });
            return successResponse(res, {
              message: 'State deleted successfully',
            })
          } catch (error) {
            return errorResponse(error, req, res)
          } 
    },
    getstates : async  (req,res)=>{
        try {
            const coutries = await STATE.findAll({})
            return successResponse(res, {
              data: coutries,
            })
          } catch (error) {
            return errorResponse(error, req, res)
          }
    },
    getStateById : async  (req,res)=>{
        try {
            const stateInfo = await STATE.findByPk(req.query.id)
            if (!stateInfo) {
              return badRequestResponse(res, {
                message: 'State not found',
              })
            }
            return successResponse(res, {
              data: stateInfo,
            })
          } catch (error) {
            return errorResponse(error, req, res)
          }
         
    },
}
