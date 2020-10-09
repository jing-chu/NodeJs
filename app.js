const path = require('path')
const http = require('http')   //import http: a core module

const express = require('express')  //import express: a third part module 
const bodyParser = require('body-parser') //import body-parser: a third part module

const errorController = require('./controllers/error')
//const db = require('./util/database')
const sequelize = require('./util/database')
const Product = require('./models/product')
const User = require('./models/user')
const Cart = require('./models/cart')
const CartItem = require('./models/cart-item')

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
  User.findByPk(1)
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

Product.belongsTo(User, { constrains: true, onDelete: 'CASCADE' })
User.hasMany(Product)
User.hasOne(Cart)
Cart.belongsTo(User)
Cart.belongsToMany(Product, { through: CartItem })
Product.belongsToMany(Cart, { through: CartItem })

sequelize
  //.sync({ force: true })
  .sync()
  .then(result => {
    return User.findByPk(1)
  })
  .then(user => {
    if(!user) {
      return User.create({ name: 'Max', email: 'test@test.com' })
    } 
    return user
  })
  .then(user => {
    return user.createCart()    
  })
  .then(cart => {
    app.listen(3000)
  })
  .catch(err => console.log(err))


