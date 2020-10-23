/** CONTROLLER: Routes commands to the model and view parts
 * Connects Model and View
 * Should only make sure the two can communicate
 */

const Product = require('../models/product')
const Order = require('../models/Order')
const user = require('../models/user')

exports.getProducts = (req, res, next) => {
  Product.find()   //find() is from mongoose, find all products
    .then((products) => {
      console.log(products)
      res.render('shop/product-list',{   //views 
        prods: products, 
        pageTitle: 'All Products', 
        path: "/products",   //navigation.ejs
        isAuthenticated: req.session.isLoggedIn
      })
    })
    .catch(err => console.log(err))
}

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productID
  Product.findById(prodId)   //findById() is from Mongoose
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: "/products",
        isAuthenticated: req.session.isLoggedIn
      })
    })
    .catch(err => console.log(err))
}

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render('shop/index',{
        prods: products, 
        pageTitle: 'Shop', 
        path: "/",
        isAuthenticated: req.session.isLoggedIn
      })
    })
    .catch(err => console.log(err))  
}

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')  //populate() doesn't return a promise, so
    .execPopulate()      // to chain a execPopulate() to get a promise
    .then(user => {
      console.log(user.cart.items)
      const products = user.cart.items
      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart',
        products: products,
        isAuthenticated: req.session.isLoggedIn 
      })  
    })
    .catch(err => console.log(err))
}

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product)
    })
    .then(result => {
      console.log(result)
      res.redirect('/cart')
    })
    .catch(err => {console.log(err)})
}


exports.postDeleteCartProduct = (req, res, next) => {
  const prodId = req.body.productId
  req.user
  .removeFromCart(prodId)
  .then(result => {
    res.redirect('/cart')
  })
  .catch(err => console.log(err))    
}

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      console.log(user.cart.items)
      const products = user.cart.items.map(i => {
        return {quantity: i.quantity, product: {...i.productId._doc}} //pull out all the data in the document we retrieved
      })
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user
        },
        products: products
      })
      return order.save()
    })
    .then(result => {
      return req.user.clearCart()
      
    })
    .then(() => {
      res.redirect('/orders')
    })
    .catch(err => console.log(err))
  }

exports.getOrders = (req, res, next) => {
  Order.find({'user.userId': req.user._id})
    .then(orders => {
      res.render('shop/orders', {
        pageTitle: 'Your Orders',
        path: '/orders',
        orders: orders,
        isAuthenticated: req.session.isLoggedIn
      })
    })
    .catch(err => console.log(err)) 
}


 