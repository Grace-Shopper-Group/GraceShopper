const express = require('express');
const router = express.Router();
const { updateCart, emptyCart, getCartById, getCartByProductId, getCartByUserId, addProductToCart } = require ('../db/cart')
const {requireUser} = require('./utils');


router.get('/:userId/cart', async (req,res,next) => {

    try{
    const { userId } = req.params;
    
    const cart = await getCartByUserId(userId)

    console.log ("api CartbyUserId", cart)
   
    if (!cart){
      
      res.send({
        error: "Error",
        name: 'CartDoesNotExistsError',
        message: `Cart for userId ${userId} not found`
    }) 
    }
    else {
        res.send (cart);
    }
    } catch ({ name, message})  {
      next({ name, message });
    }   
    });

    router.get('/:productId', async (req,res,next) => {

      try{
      const { productId } = req.params;
      const user = req.user
      console.log ("getCartByProductId API>productId, user", productId, user)
      const cart = await getCartByProductId(productId, user)
      console.log ("getCartByProductId API>cart", cart)
      if (!cart){
        
        res.send({
          // error: "Error",
          // name: 'CartDoesNotExistsError',
          message: `Cart for productId ${productId} not found`
      }) 
      }
      else {
          res.send (cart);
      }
      } catch ({ name, message})  {
        next({ name, message });
      }   
      });
  


    router.post('/', requireUser, async (req, res, next) => {
  
      const user= req.user
      
       const { cartId } = req.params;
      
       const { quantity, productId } = req.body;
       console.log ("user", user, productId, quantity)
   
       const fields = {
       quantity : quantity,
       userId : user.id,
       productId : productId
       } 
       
     try {
        const newCart = await addProductToCart(fields);
         console.log ("newCart", newCart)
        res.send( newCart )
       
         
         } catch ({ name, message }) {
         next({ name, message });
       }
     
   });
   

router.patch('/:cartId', requireUser, async (req, res, next) => {
  
   const user= req.user
    const { cartId } = req.params;
   
    const { quantity } = req.body;
    console.log ("user, user.id, cartId, quantity", user, user.id, cartId, quantity)

    const updateFields = {};
    
    if (quantity) {
      updateFields.quantity = quantity;
    }

    if (cartId) {
      updateFields.id = cartId
    }
    
    
  try {
     const cart = await getCartById(cartId);
     console.log ("cart", cart)
    
     if (!user || user.id !== cart.userId){
      res.status(403)
        res.send({ 
          error: "Error",
          name: "Unathorized user error",
          message: `User ${user.username} is not allowed to update this cart`})
     }else {
      console.log ("hello")
      const updatedCart = await updateCart(updateFields);
      
        res.send( updatedCart )
    
      
      }} catch ({ name, message }) {
      next({ name, message });
    }
  
});


// DELETE /api/routine_activities/:routineActivityId
router.delete('/:cartId', async (req, res, next) => {
const user = req.user
 
   try {
       
       const cart = await getCartById(req.params.cartId);

      if (user.id === cart.userId){
      
         const emptiedCart = await emptyCart(cart.id);
       
         res.send(emptiedCart);
      } else {
        res.status(403)
        res.send({ 
          error: "Error",
          name: "Unathorized user error",
          message: `User ${user.username} is not allowed to delete this cart`})
      }
   
     } catch ({name, message}){
       next({name, message})
     }
     
  });




module.exports = router;
