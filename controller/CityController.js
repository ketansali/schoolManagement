const mongoose = require('mongoose')
const errorResponse = require('../middleware/error-response')
const CITY = mongoose.model('city')
const {decodeUris, cloneDeep}  = require('../lib/commonQuery')
const { successResponse, badRequestResponse } = require('../middleware/response')

exports.city = {
    addCity : async  (req,res)=>{
        try {
            req.body = decodeUris(req.body)
            const cityInfo = await CITY.findOne({
                cityName: {$regex : req.body.cityName, $options:'i'},
              },);
              if (cityInfo) {
                return badRequestResponse(res, {
                  message: "City already exist!",
                });
              }
            const country = {
                cityName: req.body.cityName,
                createdBy: req.user._id,
                stateId :req.body.stateId,
                isActive: true
            }

            const isCreated = await CITY.create(country)
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
            req.body = decodeUris(req.body)
            const cityInfo = await CITY.findOne({
              _id: req.body.id,
            })
            if (!cityInfo) {
              return badRequestResponse(res, {
                message: 'City not found',
              })
            }
            await CITY.findOneAndUpdate(
              { _id: cityInfo._id },
              {
                $set: {
                  cityName: req.body.cityName,
                 updatedBy :req.user._id,
                 stateId :req.body.stateId
                },
              },
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
            const cityInfo = await CITY.findOne({
              _id: req.query.id,
            })
            if (!cityInfo) {
              return badRequestResponse(res, {
                message: 'City not found',
              })
            }
            await CITY.findByIdAndRemove({
              _id: cityInfo._id,
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
            req.body = decodeUris(req.body)
            const coutries = await CITY.find({})
            return successResponse(res, {
              data: cloneDeep(coutries),
            })
          } catch (error) {
            return errorResponse(error, req, res)
          }
    },
    getCityById : async  (req,res)=>{
        try {
            req.body = decodeUris(req.body)
            const cityInfo = await CITY.findOne({
              _id: req.query.id,
            })
            if (!cityInfo) {
              return badRequestResponse(res, {
                message: 'City not found',
              })
            }
            return successResponse(res, {
              data: cloneDeep(cityInfo),
            })
          } catch (error) {
            return errorResponse(error, req, res)
          }
         
    },
}
