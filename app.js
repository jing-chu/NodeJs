const path = require('path')

const express = require('express')  //import express: a third part module 
const bodyParser = require('body-parser') //import body-parser: a third part module
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')  //csrf Protection
const flash = require('connect-flash')
const multer = require('multer')

const errorController = require('./controllers/error')
const User = require('./models/user')

const MONGODB_URI = 'mongodb+srv://jing_nodejs:jing_nodejs@cluster0.yfoug.mongodb.net/shop?retryWrites=true&w=majority'

const app = express()
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
})
const csrfProtection = csrf()

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images')
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' 
    || file.mimetype === 'image/jpg' 
    || file.mimetype === 'image/jpeg') {
      cb(null, true)
    } else {
      cb(null, false)
    }
}

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
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(
  session({
    secret: 'my secret', 
    resave: false, 
    saveUninitialized: false, 
    store: store})
)
app.use(csrfProtection)
app.use(flash())  // initialize after the session

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn,
  res.locals.csrfToken = req.csrfToken()
  next()
})

app.use((req, res, next) => {
  if (!req.session.user) {
    return next()
  }
  User.findById(req.session.user._id)
  .then(user => {
    if(!user) {
      return next()
    }
   req.user = user
   next()
 })
  .catch(err => {
    next(new Error(err))
  })  
})



// routers middleware
app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)

//handle errors
app.get('/500', errorController.get500)
app.use(errorController.get404)

app.use((error, req, res, next) => {
  //res.redirect('/500')
  res.status(500).render('500', {
    pageTitle: "Error!",
    path: "/500",
    isAuthenticaed: req.session.isLoggedIn
  })
})

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(process.env.PORT || 3000)
  })
  .catch(err => {
    console.log(err)
  })
