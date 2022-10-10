require('dotenv').config()
require('./config/db')
require('./config/table')
const express = require('express')
const cors = require('cors')
const app = express()
const routes = require('./routes/index')
const notFound = require('./middleware/404')
const errorHandler = require('./middleware/error-handler')
const fileUpload = require('express-fileupload')
const swaggerJson = require('./swagger/swagger.json')
const swaggerUi = require('swagger-ui-express')
const { corsOptionsDelegate } = require('./middleware/cors')
const path = require('path')
var options = {
  swaggerOptions: {
    authAction :{ JWT: {name: "JWT", schema: {type: "apiKey", in: "header", name: "Authorization", description: ""}, value: "Bearer <JWT>"} }
  }
};
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerJson,options))

// format
app.use(
    express.json({
      limit: '1024mb',
    }),
  )
  app.use(
    express.urlencoded({
      limit: '1024mb',
      extended: true,
    }),
  )
// cors
app.use(cors(corsOptionsDelegate))

// fileupload
app.use(fileUpload({limits: {
  fileSize: 1024 * 1024 // 1 MB
},
abortOnLimit: true}))

app.use('/users',express.static(path.join(__dirname,'uploads','users')))
app.use('/eventes',express.static(path.join(__dirname,'uploads','eventes')))
// api routes
app.use('/api', routes)


// catch 404 and forward to error handler
app.use(notFound)

// error handler
app.use(errorHandler)

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on PORT: ${process.env.PORT} `)
})