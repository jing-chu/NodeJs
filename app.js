const path = require('path')
const http = require('http')   //import http: a core module

const express = require('express')  //import express: a third part module 
const bodyParser = require('body-parser') //import body-parser: a third part module

const errorController = require('./controllers/error')
const mongoConnect = require('./util/database').mongoConnect
const User = require('./models/user')

const app = express()

app.set('view engine','ejs')
app.set('views','views')

const adminRoutes = require('./routers/admin')
const shopRouter = require('./routers/shop')


//// where to write middlewares: after app object and before app.listen()

/** 
app.use((req, res, next) => {
  console.log('In the middleware!')
  next()  // Allows the request to continue to the next middleware in line
})
*/

//the order of the two middleware is important

//body-parser middleware: before routers middleware
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname, 'public')))
app.use((req,res,next) => {
  User.findById('5f894c8c919d310af8024198')
  .then(user => {
    req.user = new User(user.name, user.email, user.cart, user._id)
    next()
 })
  .catch(err => console.log(err))
})

// routers middleware
app.use('/admin', adminRoutes)
app.use(shopRouter.router)

//handle 404 error
app.use(errorController.getErrorPage)

mongoConnect(() => {
  app.listen(3000)
})