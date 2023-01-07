const express = require('express');
const productsRouter = express.Router();
const { getAllProducts, createProduct } = require('../db')

productsRouter.get('/products', async (req, res, next) => {
    const allProducts = await getAllProducts()
        if(allProducts){console.log('allProducts', allProducts)}
    res.send(allProducts)

})