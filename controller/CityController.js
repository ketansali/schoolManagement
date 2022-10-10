
const errorResponse = require('../middleware/error-response')
const CITY = require('../models/citySchema')
const { successResponse, badRequestResponse } = require('../middleware/response')
const { Sequelize,Op } = require("sequelize");
exports.city = {
    addCity : async  (req,res)=>{
        try {

            const cityInfo = await CITY.findOne({
              where: {
                cityName: Sequelize.where(
                  Sequelize.fn("LOWER", Sequelize.col("cityName")),
                  "LIKE",
                  "%" + req.body.cityName.toLowerCase() + "%"
                ),
              }
              },);
              if (cityInfo) {
                return badRequestResponse(res, {
                  message: "City already exist!",
                });
              }
            const city = {
                cityName: req.body.cityName,
               createdBy: req.user.Id,
                StateId :req.body.StateId,
                isActive: true
            }

            const isCreated = await CITY.create(city)
            if (isCreated) {
              return successResponse(res, {
                message: 'City created successfully',
              })
            } else {
              return badRequestResponse(res, {
                message: 'Failed to create City',
              })
            }
          } catch (error) {
            return errorResponse(error, req, res)
          }
         
    },
    updateCity : async  (req,res)=>{
        try {
            const cityInfo = await CITY.findByPk(req.body.id)
            if (!cityInfo) {
              return badRequestResponse(res, {
                message: 'City not found',
              })
            }
            const nameExisted = await CITY.findOne({
              where: { [Op.and]:{
                cityName: Sequelize.where(
                  Sequelize.fn("LOWER", Sequelize.col('cityName')),
                  "LIKE",
                  "%" + req.body.cityName.toLowerCase() + "%"
                ),
                Id :{
                  [Op.ne]:req.body.id
                }
              }   
              },
            })
            if(nameExisted) return badRequestResponse(res,{
              message :'City already exist!'
            })
            await CITY.update(
             {
                  cityName: req.body.cityName,
                 updatedBy :req.user.Id,
                 stateId :req.body.stateId
                },
                {where : {Id :cityInfo.Id }}
            )
            return successResponse(res, {
              message: 'City updated successfully',
            })
          } catch (error) {
            return errorResponse(error, req, res)
          } 
    },
    deleteCity : async  (req,res)=>{
        try {
            const cityInfo = await CITY.findByPk(req.query.id)
            if (!cityInfo) {
              return badRequestResponse(res, {
                message: 'City not found',
              })
            }
            await CITY.destroy({
              where: { Id: req.query.id },
            })
            return successResponse(res, {
              message: 'City deleted successfully',
            })
          } catch (error) {
            return errorResponse(error, req, res)
          } 
    },
    getcitys : async  (req,res)=>{
        try {
            const coutries = await CITY.findAll({})
            return successResponse(res, {
              data: coutries
            })
          } catch (error) {
            return errorResponse(error, req, res)
          }
    },
    getCityById : async  (req,res)=>{
        try {
            const cityInfo = await CITY.findByPk(req.query.id)
            if (!cityInfo) {
              return badRequestResponse(res, {
                message: 'City not found',
              })
            }
            return successResponse(res, {
              data: cityInfo
            })
          } catch (error) {
            return errorResponse(error, req, res)
          }
         
    },
}
