const router = require("express").Router()
const userController = require('../controller/userController')
const { userValidation } = require("../validator/userValidation")

router.post('/add',userValidation,(req,res)=>{
    return userController.user.addUser(req,res)
})
router.post('/update',(req,res)=>{
    return userController.user.updateUser(req,res)
})
router.get('/get',(req,res)=>{
    return userController.user.getUsers(req,res)
})
router.delete('/delete',(req,res)=>{
    return userController.user.deleteUser(req,res)
})
router.get('/get-user-by-id',(req,res)=>{
    return userController.user.getUserById(req,res)
})



module.exports = router