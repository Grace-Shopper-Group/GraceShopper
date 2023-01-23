const client = require("./client.js")

async function getAllProducts(){
try {
    const { rows } = await client.query(`
    SELECT * FROM products
    `)
    return rows
} catch (error) {
    console.log("Could not get all products from DB")
    return
  }
}

async function getProductById(productId){
    try {
  
      const { rows: [product] } = await client.query(`
      SELECT * FROM products
      WHERE id = $1;
      `, [productId]);
  
      return product
    
    } catch (error) {
      console.log ("Error in getProductById")
      throw error;
  
    }
  }


async function createProduct( brand, description, category, price, imageUrl ) {
 
    try {
      const { rows } = await client.query(`
          INSERT INTO products(brand, description, category, price, "imageUrl")
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *;
        `, [brand, description, category, price, imageUrl]);
       
        
      return rows;
  
    } catch (error) {
      console.log(error);
      return;
    }
    
  }

  async function updateProduct(productId, fields) {

    const {brand, description, category, price, imageUrl} = fields

    console.log ("fields>>>>>>>>", fields)
    
    const setString = Object.keys(fields).map((key, index) => `"${ key }"=$${ index + 1}`).join(', ');

    if (setString.length === 0) {
      return;
    }
  
  console.log (setString)
  try {
      const { rows: [product] } = await client.query(`
      UPDATE products
      SET ${setString}
      WHERE id = ${productId}
      RETURNING *;
  `, Object.values(fields));
  
      console.log (product)
      return product;
  } catch (error) {
      console.log ("Error in updateProduct function")
      throw error;
    }
  }

    async function deleteProduct(id){
        try {
            const { rows } = await client.query(`
             DELETE FROM products
             WHERE id=$1;
            `, [id]);
        
            return rows;
          } catch (error) {
            return {
              error: "Error deleting product!"
            }
          }
        }
  
    module.exports = { 
        getAllProducts,
        getProductById,
        createProduct,
        updateProduct,
        deleteProduct }
