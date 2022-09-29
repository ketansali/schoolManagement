const router = require("express").Router()
const stateController = require('../controller/StateController')
const { stateValidation } = require("../validator/stateValidation")

router.post('/add',stateValidation,(req,res)=>{
    return stateController.state.addState(req,res)
})
router.post('/update',(req,res)=>{
    return stateController.state.updateState(req,res)
})
router.get('/get',(req,res)=>{
    return stateController.state.getstates(req,res)
})
router.delete('/delete',(req,res)=>{
    return stateController.state.deleteState(req,res)
})
router.get('/get-state-by-id',(req,res)=>{
    return stateController.state.getStateById(req,res)
})



module.exports = router