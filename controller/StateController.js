const mongoose = require('mongoose')
const errorResponse = require('../middleware/error-response')
const STATE = mongoose.model('state')
const {decodeUris, cloneDeep}  = require('../lib/commonQuery')
const { successResponse, badRequestResponse } = require('../middleware/response')

exports.state = {
    addState : async  (req,res)=>{
        try {
            req.body = decodeUris(req.body)
            const stateInfo = await STATE.findOne({
                stateName: {$regex : req.body.stateName, $options:'i'},
              },);
              if (stateInfo) {
                return badRequestResponse(res, {
                  message: "State already exist!",
                });
              }
            const country = {
                stateName: req.body.stateName,
                createdBy: req.user._id,
                countryId :req.body.countryId,
                isActive: true
            }

            const isCreated = await STATE.create(country)
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
            req.body = decodeUris(req.body)
            const stateInfo = await STATE.findOne({
              _id: req.body.id,
            })
            if (!stateInfo) {
              return badRequestResponse(res, {
                message: 'State not found',
              })
            }
            await STATE.findOneAndUpdate(
              { _id: stateInfo._id },
              {
                $set: {
                  stateName: req.body.stateName,
                  updatedBy :req.user._id,
                  countryId :req.body.countryId
                },
              },
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
            const stateInfo = await STATE.findOne({
              _id: req.query.id,
            })
            if (!stateInfo) {
              return badRequestResponse(res, {
                message: 'State not found',
              })
            }
            await STATE.findByIdAndRemove({
              _id: stateInfo._id,
            })
            return successResponse(res, {
              message: 'State deleted successfully',
            })
          } catch (error) {
            return errorResponse(error, req, res)
          } 
    },
    getstates : async  (req,res)=>{
        try {
            req.body = decodeUris(req.body)
            const coutries = await STATE.find({})
            return successResponse(res, {
              data: cloneDeep(coutries),
            })
          } catch (error) {
            return errorResponse(error, req, res)
          }
    },
    getStateById : async  (req,res)=>{
        try {
            req.body = decodeUris(req.body)
            const stateInfo = await STATE.findOne({
              _id: req.query.id,
            })
            if (!stateInfo) {
              return badRequestResponse(res, {
                message: 'State not found',
              })
            }
            return successResponse(res, {
              data: cloneDeep(stateInfo),
            })
          } catch (error) {
            return errorResponse(error, req, res)
          }
         
    },
}
