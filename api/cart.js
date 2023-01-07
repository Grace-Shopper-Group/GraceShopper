const express = require('express');
const router = express.Router();
const { updateCart, emptyCart, getCartById } = require ('../db/cart')
const {requireUser} = require('./utils');


router.patch('/:cartId', requireUser, async (req, res, next) => {
  
   const user= req.user
    const { cartId } = req.params;
   
    const { quantity } = req.body;

    const updateFields = {};
    
    if (quantity) {
      updateFields.quantity = quantity;
    }

    if (cartId) {
      updateFields.id = cartId
    }
    
    
  try {
     const cart = await getCartById(cartId);
    
     if (!user || user.id !== cart.userId){
      res.status(403)
        res.send({ 
          error: "Error",
          name: "Unathorized user error",
          message: `User ${user.username} is not allowed to update this cart`})
     }else {
      
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
