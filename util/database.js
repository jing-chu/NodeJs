const Sequelize = require('sequelize')

const sequelize = new Sequelize('node-complete', 'root', 'gre1983220', {
  dialect: 'mysql',
  host: 'localhost'
})

module.exports = sequelize



/* 
const mysql = require('mysql2')

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  database: 'node-complete',
  password: 'gre1983220'
})

module.exports = pool.promise()
*/