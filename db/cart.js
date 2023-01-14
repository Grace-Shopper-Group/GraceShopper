const client = require("./client");

async function addProductToCart({
    userId,
    productId,
    quantity
  }) {
  
  //console.log ("INPUTS to addActivityToROUTINE", routineId, activityId, count, duration)
    try {
      const { rows: cartitem } = await client.query(`
      INSERT INTO cart ("userId", "productId", quantity) 
      VALUES ($1, $2, $3)
      RETURNING *;
      `, [userId, productId, quantity]);
      
    
      return cartitem[0]
  }catch (error) {
      console.log ("Error in addProductToCart function" + error)
      throw error;
    }
  }

  async function getCartById(id){

    // console.log ("KKKKKKKKKKK", id)
     try{
       const {rows: cart } = await client.query(`
       SELECT * 
       FROM cart
       WHERE id = $1;
      `, [id])
     // console.log ("KKKKKKKKKKK", cart)
       return cart[0]
     }catch (error) {
       console.log ("Error in getCartById function" + error)
       throw error;
     }
     
   
   }

   async function getCartByUserId(userId){

    // console.log ("KKKKKKKKKKK", userId)
     try{
       const {rows: cart } = await client.query(`
       SELECT * 
       FROM cart
       WHERE "userId" = $1;
      `, [id])
     // console.log ("KKKKKKKKKKK", cart)
       return cart[0]
     }catch (error) {
       console.log ("Error in getCartById function" + error)
       throw error;
     }
     
   
   }




  async function updateCart ({...fields}) {
    console.log("db/cart/updateCart", fields)
    //    const {cartId, quantity} = fields

    //console.log(cartId, quantity)
        
    const setString = Object.keys(fields).map(
          (key, index) => `"${ key }"=$${ index + 1 }`
      ).join(', ');
        console.log (setString)
       try {
            const {rows: updatedCart} = await client.query(`
            UPDATE cart
            SET ${setString}
            WHERE id = ${ cartId }
            RETURNING *;
            `, [ quantity ]);
    
         //  console.log (">>>>>>",updatedCart[0])
        
       return updatedCart[0]
    
        } catch (error) {
            console.log ("Error in updateCart function")
            throw error;
        }
    
    }
    
    
    
    
    async function emptyCart(cartId) {
    
    
      try{
      const { rows: emptyCart } = await client.query(`
      DELETE FROM cart
      WHERE cart.id = $1
      RETURNING *;
      `, [cartId])
    
      console.log (emptyCart)
    return emptyCart[0]
    
    } catch (error) {
      console.log ("Error in emptyCart function")
      throw error;
    }
    
    
    
    }


  module.exports = {
    addProductToCart,
    getCartById,
    getCartByUserId,
    updateCart,
    emptyCart,
}