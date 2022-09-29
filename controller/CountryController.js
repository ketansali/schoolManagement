const mongoose = require('mongoose')
const errorResponse = require('../middleware/error-response')
const COUNTRY = mongoose.model('country')
const {decodeUris, cloneDeep}  = require('../lib/commonQuery')
const { successResponse, badRequestResponse } = require('../middleware/response')

exports.country = {
    addCountry : async  (req,res)=>{
        try {
            req.body = decodeUris(req.body)
            const countryInfo = await COUNTRY.findOne({
                countryName: {$regex : req.body.countryName, $options:'i'},
              },);
              if (countryInfo) {
                return badRequestResponse(res, {
                  message: "Country already exist!",
                });
              }
            
            const country = {
                countryName: req.body.countryName,
                createdBy: req.user._id,
                isActive: true
            }

            const isCreated = await COUNTRY.create(country)
            if (isCreated) {
              return successResponse(res, {
                message: 'Country created successfully',
              })
            } else {
              return badRequestResponse(res, {
                message: 'Failed to create Country',
              })
            }
          } catch (error) {
            return errorResponse(error, req, res)
          }
         
    },
    updateCountry : async  (req,res)=>{
        try {
            req.body = decodeUris(req.body)
            const countryInfo = await COUNTRY.findOne({
              _id: req.body.id,
            })
            if (!countryInfo) {
              return badRequestResponse(res, {
                message: 'Country not found',
              })
            }
            await COUNTRY.findOneAndUpdate(
              { _id: countryInfo._id },
              {
                $set: {
                  countryName: req.body.countryName,
                 updatedBy :req.user._id
                },
              },
            )
            return successResponse(res, {
              message: 'Country updated successfully',
            })
          } catch (error) {
            return errorResponse(error, req, res)
          } 
    },
    deleteCountry : async  (req,res)=>{
        try {
            const countryInfo = await COUNTRY.findOne({
              _id: req.query.id,
            })
            if (!countryInfo) {
              return badRequestResponse(res, {
                message: 'Country not found',
              })
            }
            await COUNTRY.findByIdAndRemove({
              _id: countryInfo._id,
            })
            return successResponse(res, {
              message: 'Country deleted successfully',
            })
          } catch (error) {
            return errorResponse(error, req, res)
          } 
    },
    getCountries : async  (req,res)=>{
        try {
            req.body = decodeUris(req.body)
            const coutries = await COUNTRY.find({})
            return successResponse(res, {
              data: cloneDeep(coutries),
            })
          } catch (error) {
            return errorResponse(error, req, res)
          }
    },
    getCountryById : async  (req,res)=>{
        try {
            req.body = decodeUris(req.body)
            const countryInfo = await COUNTRY.findOne({
              _id: req.query.id,
            })
            if (!countryInfo) {
              return badRequestResponse(res, {
                message: 'Country not found',
              })
            }
            return successResponse(res, {
              data: cloneDeep(countryInfo),
            })
          } catch (error) {
            return errorResponse(error, req, res)
          }
         
    },
}
