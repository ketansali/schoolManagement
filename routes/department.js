const router = require("express").Router()
const departmentController = require('../controller/DepartmentController')
const { departmentValidation } = require("../validator/departmentValidation")

router.post('/add',departmentValidation,(req,res)=>{
    return departmentController.department.addDepartment(req,res)
})
router.post('/update',(req,res)=>{
    return departmentController.department.updateDepartment(req,res)
})
router.get('/get',(req,res)=>{
    return departmentController.department.getDepartments(req,res)
})
router.delete('/delete',(req,res)=>{
    return departmentController.department.deleteDepartment(req,res)
})
router.get('/get-department-by-id',(req,res)=>{
    return departmentController.department.getDepartmentById(req,res)
})



module.exports = router