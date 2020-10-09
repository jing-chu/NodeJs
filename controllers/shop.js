/** CONTROLLER: Routes commands to the model and view parts
 * Connects Model and View
 * Should only make sure the two can communicate
 */

const Product = require('../models/product')
const Cart = require('../models/cart')

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render('shop/product-list',{   //views 
        prods: products, 
        pageTitle: 'All Products', 
        path: "/products"   //navigation.ejs
      })
    })
    .catch(err => console.log(err))
}

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productID
  Product.findAll({ where: { id: prodId }})
    .then(products => {
      res.render('shop/product-detail', {
        product: products[0],
        pageTitle: products[0].title,
        path: "/products"
      })
    })
    .catch(err => console.log(err))
  //Product.findByPk(prodId)
  //  .then((product) => {
  //   res.render('shop/product-detail', {
  //      product: product,
  //      pageTitle: product.title,
  //      path: "/products"
  //    })
  //  })
   // .catch(err => console.log(err))  
}

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render('shop/index',{
        prods: products, 
        pageTitle: 'Shop', 
        path: "/"
      })
    })
    .catch(err => console.log(err))  
}

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(cart => {
      console.log(cart)
      return cart.getProducts()
      .then(products => {
        res.render('shop/cart', {
          pageTitle: 'Your Cart',
          path: '/cart',
          products: products  
        })  
      })
      .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
  /** 
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = []
      for (product of products) {
        const cartProductData = cart.products.find(prod => prod.id === product.id)
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty})
        }
      }
        res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart',
        products: cartProducts  
      })    
    })
  })  
  */
}

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId
  Product.findById(prodId, product => {
    Cart.addProduct(prodId, product.price)
  })
  res.redirect('/cart')
}

exports.postDeleteCartProduct = (req, res, next) => {
  const prodId = req.body.productId
  Product.findById(prodId, product => {
    Cart.deleteProduct(prodId, product.price)
    res.redirect('/cart') 
  })   
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    pageTitle: 'Your Orders',
    path: '/orders'
  })
}

exports.getCheckout = (req, res, next) => {
  res.render(('shop/checkout',{
    pageTitle: 'Checkout',
    path: '/checkout'
  }))
}

