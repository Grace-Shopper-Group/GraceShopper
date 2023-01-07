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

async function createProduct({id, brand, description, category, price}) {
  
    try {
      const { rows: [routine] } = await client.query(
        `
          INSERT INTO products (id, brand, description, category, price)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (name) DO NOTHING
          RETURNING *;
        `, 
        [id, brand, description, category, price]);
  
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
  
    module.exports(getAllProducts, createProduct)