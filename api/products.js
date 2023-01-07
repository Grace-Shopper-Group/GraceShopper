const express = require('express');
const productsRouter = express.Router();
const { getAllProducts, createProduct } = require('../db')

productsRouter.get('/products', async (req, res) => {
    const allProducts = await getAllProducts()
        
        if (allProducts) {
            console.log('allProducts', allProducts)
        }
    res.send(allProducts)
})

productsRouter.post('/products', async (req, res) => {
    const { brand, description, category, price, img } = req.body

    const newProduct = await createProduct(brand, description, category, price, img)

    res.send(newProduct)
})

productsRouter.patch('/products:productId', async (req, res) => {
  
})

productsRouter.delete('/products:productId', async (req, res) => {
  
})