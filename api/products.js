const express = require('express');
const {requireUser} = require('./utils');
const jwt = require('jsonwebtoken');
const  {JWT_SECRET}= process.env;
const productsRouter = express.Router();
const { getAllProducts, createProduct, deleteProduct, updateProduct } = require('../db')

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
    const productId = req.params
    const fields = req.body
    const user = req.user

    const prefix = 'Bearer ';
    const auth = req.header('Authorization');

    if (!auth) { 
        res.status(401)
        res.send ({
            error: "Error",
            name: "Must be logged in Error",
            message: "You must be logged in to perform this action"
            });
        }
    const token = auth.slice(prefix.length);

    const { id } = jwt.verify(token, JWT_SECRET);

    try {
        if (user.isAdmin === false){

            res.status(403);
            res.send({
                error: "Error",
                name: "UnauthorizedUserError",
                message: `User ${req.user.username} is not allowed to update product` 
        })} else { 
            const patchedProduct = await updateProduct(productId, fields) 
            res.send(patchedProduct)
        }} catch (error){ 
            console.log(error)
    }
})

productsRouter.delete('/:productId', async (req, res) => {
    const productId = req.params

    const deletedProduct = await deleteProduct(productId)

    res.send(deletedProduct)
})