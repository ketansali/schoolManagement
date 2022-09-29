'use strict'
const mongoose = require('mongoose')
require('../models/citySchema')
require('../models/countrySchema')
require('../models/courseSchema')
require('../models/departmentSchema')
require('../models/eventSchema')
require('../models/stateSchema')
require('../models/userSchema')


//console.log('dburl', process.env.databaseUri)
mongoose.set('debug', (collectionName, method, query, doc) => {
  console.log(`${collectionName}.${method}`, JSON.stringify(query), doc)
})
mongoose.Promise = global.Promise

mongoose.connect(process.env.databaseUri)

let db = mongoose.connection
db.on('error', console.error.bind(console, 'connection failed'))

db.once('open', function () {
  console.log('Database connected successfully!')
})
