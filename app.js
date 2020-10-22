const path = require('path')
const http = require('http')   //import http: a core module

const express = require('express')  //import express: a third part module 
const bodyParser = require('body-parser') //import body-parser: a third part module
const mongoose = require('mongoose')

const errorController = require('./controllers/error')
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
  User.findById('5f8ff0302545ae128769c1da')
  .then(user => {
    req.user = user
    next()
 })
  .catch(err => console.log(err))
})

// routers middleware
app.use('/admin', adminRoutes)
app.use(shopRouter.router)

//handle 404 error
app.use(errorController.getErrorPage)

mongoose
  .connect('mongodb+srv://jing_nodejs:jing_nodejs@cluster0.yfoug.mongodb.net/shop?retryWrites=true&w=majority')
  .then(result => {
    User.findOne().then( user => {
      if (!user) {
        const user = new User({
          name: 'Max',
          email: 'max@teset.com',
          cart: {
            items: []
          }
        })
        user.save()
      }
    })
    app.listen(3000)
  })
  .catch(err => {
    console.log(err)
  })
