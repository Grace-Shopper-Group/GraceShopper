const client = "./client.js"

const getAllProducts = async() => { 
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

async function createProduct({id, name, description, category, price}) {
  
    try {
      const { rows: [routine] } = await client.query(
        `
          INSERT INTO products (id, name, description, category, price)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (name) DO NOTHING
          RETURNING *;
        `, 
        [id, name, description, category, price]);
  
      return routine;
  
    } catch (error) {
      console.log("Could not create product in DB");
      return;
    }
    
  }