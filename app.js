const path = require('path')

const express = require('express')  //import express: a third part module 
const bodyParser = require('body-parser') //import body-parser: a third part module
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)

const errorController = require('./controllers/error')
const User = require('./models/user')

const MONGODB_URI = 'mongodb+srv://jing_nodejs:jing_nodejs@cluster0.yfoug.mongodb.net/shop?retryWrites=true&w=majority'

const app = express()
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
})

app.set('view engine','ejs')
app.set('views','views')

//registrate routes
const adminRoutes = require('./routers/admin')
const shopRoutes = require('./routers/shop')
const authRoutes = require('./routers/auth')

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
app.use(
  session({secret: 'my secret', resave: false, saveUninitialized: false, store: store})
)

app.use((req, res, next) => {
  if (!req.session.user) {
    return next()
  }
  User.findById(req.session.user._id)
  .then(user => {
   req.user = user
   next()
 })
  .catch(err => console.log(err))  
})

// routers middleware
app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)

//handle 404 error
app.use(errorController.getErrorPage)

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(3000)
  })
  .catch(err => {
    console.log(err)
  })
