const router = require("express").Router()
const countryController = require('../controller/CountryController')
const { countryValidation } = require("../validator/countryValidation")

router.post('/add',countryValidation,(req,res)=>{
    return countryController.country.addCountry(req,res)
})
router.post('/update',(req,res)=>{
    return countryController.country.updateCountry(req,res)
})
router.get('/get',(req,res)=>{
    return countryController.country.getCountries(req,res)
})
router.delete('/delete',(req,res)=>{
    return countryController.country.deleteCountry(req,res)
})
router.get('/get-country-by-id',(req,res)=>{
    return countryController.country.getCountryById(req,res)
})



module.exports = router