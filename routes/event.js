const router = require("express").Router()
const EventController = require('../controller/EventController')
const { eventValidation } = require("../validator/eventValidation")

router.post('/add',eventValidation,(req,res)=>{
    return EventController.event.addEvent(req,res)
})
router.post('/update',(req,res)=>{
    return EventController.event.updateEvent(req,res)
})
router.get('/get',(req,res)=>{
    return EventController.event.getEvents(req,res)
})
router.delete('/delete',(req,res)=>{
    return EventController.event.deleteEvent(req,res)
})
router.get('/get-event-by-id',(req,res)=>{
    return EventController.event.getEventById(req,res)
})



module.exports = router