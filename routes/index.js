const router = require("express").Router()


const countryRoutes = require('./country')
const stateRoutes = require('./state')
const cityRoutes = require('./city')
const  account  = require("./account")
const  user  = require("./user")
const  department  = require("./department")
const  course  = require("./course")
const  event  = require("./event")
const { ensureAuthorized } = require("../middleware/auth")

router.use('/account',ensureAuthorized,account)
router.use('/country',ensureAuthorized,countryRoutes)
router.use('/state',ensureAuthorized,stateRoutes)
router.use('/city',ensureAuthorized,cityRoutes)
router.use('/user',ensureAuthorized,user)
router.use('/department',ensureAuthorized,department)
router.use('/course',ensureAuthorized,course)
router.use('/event',ensureAuthorized,event)


module.exports = router