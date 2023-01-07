const client = "./client.js"

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

async function createProduct({brand, description, category, price, img}) {
  
    try {
      const { rows: [routine] } = await client.query(
        `
          INSERT INTO products (brand, description, category, price, img)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (brand) DO NOTHING
          RETURNING *;
        `, 
        [brand, description, category, price, img]);
  
      return routine;
  
    } catch (error) {
      console.log("Could not create product in DB");
      return;
    }
    
  }

  async function updateProduct({id, ...fields}){
    const setString = Object.keys(fields).map(
        (key, index) => `"${ key }"=$${ index + 1 }`
      ).join(', ');
    
      if (setString.length === 0) {
        return;
      }
    
      try {
        const { rows: [ product ] } = await client.query(`
          UPDATE products
          SET ${ setString }
          WHERE id=${ id }
          RETURNING *;
        `, Object.values(fields));

        console.log("updated product:", product)
    
        return product;
      } catch (error) {
        return {
          error: "Error updating product!"
        }
      }
    }

    async function deleteProduct({id}){
        try {
            const { rows: [ product ] } = await client.query(`
             DELETE FROM products
             WHERE id=$1
             RETURNING *;
            `, id);
    
            console.log("deleted product:", product)
        
            return product;
          } catch (error) {
            return {
              error: "Error deleting product!"
            }
          }
        }
  
    module.exports(getAllProducts, createProduct)
