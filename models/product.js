/**  MODEL: Handles data and business logic
 * representing data
 * managing data(saving, fetching...)
 * doesn't matter if data in memory, files, or databases
 * contains data-related logic
 */

const getDb = require('../util/database').getDb
const mongodb = require('mongodb')

class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title
    this.price = price
    this.description = description
    this.imageUrl = imageUrl
    this._id = id? new mongodb.ObjectId(id) : null
    this.userId = userId
  }

  save() {
    const db = getDb()
    let dbOp
    if(this._id) {
      // update the product
      dbOp = db
        .collection('products')
        .updateOne({_id: this._id},{ $set: this })
    } else {
      dbOp = db.collection('products').insertOne(this)
    }
    return dbOp
  }

  static fetchAll() {
    const db = getDb()
    return db
      .collection('products')
      .find()
      .toArray()
      .then(products => {
        return products
      })
      .catch(err => {
        console.log(err)
      })
  }

  static findById(prodId){
    const db = getDb()
    return db
      .collection('products')
      .find({_id: new mongodb.ObjectId(prodId)})
      .next()
      .then(product => {
        //console.log(product)
        return product
      })
      .catch(err => {
        console.log(err)
      })
  }

  static deleteById(prodId) {
    const db = getDb()
    return db
      .collection('products')
      .deleteOne({ _id: new mongodb.ObjectId(prodId) })
      .then(result => {
        console.log('Deleted!')
      })
      .catch(err => {
        console.log(err)
      })
  }
}

module.exports = Product


/**
 * 
const db = require('../util/database')
const Cart = require('./cart')

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id
    this.title = title
    this.imageUrl = imageUrl
    this.description = description
    this.price = price
  }

  save() {
    return db.execute('INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ?, ?) ',
    [this.title, this.price, this.description, this.imageUrl])
  }

  static deleteById(id) {

  }

  static fetchAll() {
    return db.execute('SELECT * from products')
  }

  static findById(id){
    return db.execute('SELECT * FROM products WHERE products.id = ?', [id])
  }

} 
 */


/*
* Fetching data from local files
const fs = require('fs')
const path = require('path')

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
)

const getProductsFromFile = (cb) => {  //helper function to avoid code repeating
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]) 
    } else {
      cb(JSON.parse(fileContent))
    }   
  })
}

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id
    this.title = title
    this.imageUrl = imageUrl
    this.description = description
    this.price = price
  }

  save() {
    
    // store a new product in products.json
    // first, to get the existing array of products (fs.readFile())
    // then, add the new data(products.push()), and then save it back to the file (fs.writheFile())
    
    getProductsFromFile(products => {
      if (this.id) {
      const existingProductIndex = products.findIndex(
        prod => prod.id === this.id
      )
      const updatedProducts = [...products]
      updatedProducts[existingProductIndex] = this
      fs.writeFile(p, JSON.stringify(updatedProducts), err => {
        console.log(err)
      })
    } else {
      this.id= Math.random().toString()
      products.push(this)
      fs.writeFile(p, JSON.stringify(products), (err) => {   //stringify array/object to json
        console.log(err)
      })
      }
      
    })
  }

  static deleteById(id) {
    getProductsFromFile(products => {
      const product = products.find(prod =>  prod.id === id )
      const updatedProducts = products.filter(prod => prod.id !== id)
      fs.writeFile(p, JSON.stringify(updatedProducts), err => {
        if (!err) {
          Cart.deleteProduct(id, product.price)
        }
      })
    })
  }

  static fetchAll(cb) {
    getProductsFromFile(cb)
  }

  static findById(id, cb) {
    getProductsFromFile(products => {
      const product = products.find(p => p.id === id)
      cb(product)
    })
  }
}

*/