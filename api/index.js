const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const { getUserById } = require('../db/users');
const { JWT_SECRET } = process.env;


// GET /api/health
router.get('/health', async (req, res, next) => {
    res.status(200);
  res.send({
    message: "system is healthy"

});
next()
});

router.use(async (req, res, next) => {
  const prefix = 'Bearer ';
    const auth = req.header('Authorization');
  
    if (!auth) { // nothing to see here
      next();
    } else if (auth.startsWith(prefix)) {
      const token = auth.slice(prefix.length);
  
      try {
        const { id } = jwt.verify(token, JWT_SECRET);
  
        if (id) {
          req.user = await getUserById(id);
          next();
        }
      } catch ({ name, message }) {
        next({ name, message });
      }
    } else {
      next({
        name: 'AuthorizationHeaderError',
        message: `Authorization token must start with ${ prefix }`
      });
    }
  });



// ROUTER: /api/users
const usersRouter = require('./users');
router.use('/users', usersRouter);

// ROUTER: /api/products
const productsRouter = require('./products');
router.use('/products', productsRouter);

// ROUTER: /api/cart
const cartRouter = require('./cart');
router.use('/cart', cartRouter);


module.exports = router;
