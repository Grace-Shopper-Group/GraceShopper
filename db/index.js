module.exports = {

    ...require('./client'), 
    ...require('./users'), // adds key/values from users.js
    ...require('./products'), // adds key/values from products.js
    ...require('./cart') // etc
  }