const express = require('express');
const { nextTick } = require('process');
const productsRouter = express.Router();
const { getAllProducts, createProduct } = require('../db')

productsRouter.get('/', async (req, res, next) => {
    const allProducts = await getAllProducts()
        
        if (allProducts) {
            console.log('allProducts', allProducts)
        }
    res.send(allProducts)
    next();
})

productsRouter.post('/', async (req, res) => {
    const { brand, description, category, price, img } = req.body

    const newProduct = await createProduct(brand, description, category, price, img)

    res.send(newProduct)
})

productsRouter.patch('/:productId', async (req, res) => {
  
})

productsRouter.delete('/:productId', async (req, res) => {
  
})