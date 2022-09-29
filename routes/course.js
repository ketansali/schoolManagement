const router = require("express").Router()
const courseController = require('../controller/CourseController')
const { courseValidation } = require("../validator/courseValidation")

router.post('/add',courseValidation,(req,res)=>{
    return courseController.course.addCourse(req,res)
})
router.post('/update',(req,res)=>{
    return courseController.course.updateCourse(req,res)
})
router.get('/get',(req,res)=>{
    return courseController.course.getCourses(req,res)
})
router.delete('/delete',(req,res)=>{
    return courseController.course.deleteCourse(req,res)
})
router.get('/get-course-by-id',(req,res)=>{
    return courseController.course.getCourseById(req,res)
})



module.exports = router