const client = require("./client");

async function dropTables() {
  
    // drop all tables, in the correct order
  
    try {
      console.log ("Starting to drop tables...");
  
      await client.query(`
      DROP TABLE IF EXISTS cart CASCADE;
      DROP TABLE IF EXISTS products CASCADE;
      DROP TABLE IF EXISTS users;
  `);
  
      console.log ("Finished dropping tables!")
  } catch (error){
      console.log("Error dropping tables!")
      throw error;
  };
  };

  async function createTables() {
  
    // create all tables, in the correct order
  
    try{
      console.log("Starting to build tables...")
  
      await client.query(`
        CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username varchar(255) UNIQUE NOT NULL,
        password varchar(255) NOT NULL,
        streetAddress varchar (255) NOT NULL,
        city varchar (255) NOT NULL,
        state varchar (255) NOT NULL,
        zip varchar (255) NOT NULL,
        phone varchar (255) NOT NULL,
        email varchar (255) NOT NULL
      );
        CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        name varchar(255) UNIQUE NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        price varchar (255) NOT NULL
      );
        CREATE TABLE cartitem (
        id SERIAL PRIMARY KEY,
        "productId" INTEGER REFERENCES products(id),
        "productName" varchar(255) REFERENCES products(name),
        "productDescription" varchar(255) REFERENCES products(desc
            ription),
        "productPrice" varchar(255 REFERENCES products(price)
      );
    `)
  
  console.log("Finished building tables!");
  } catch (error){
      console.log("Error building Tables!");
      throw error;
  }
  
  }
  


