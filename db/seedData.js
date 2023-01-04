const client = require("./client");
const { createUser } = require('./users');
const { createProduct } = require('./products');

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
        price varchar (255) NOT NULL,
        imageUrl varchar (255) NOT NULL
      );
        CREATE TABLE cartitem (
        id SERIAL PRIMARY KEY,
        "productId" INTEGER REFERENCES products(id),
        "productName" varchar(255) REFERENCES products(name),
        "productDescription" varchar(255) REFERENCES products(description),
        "productPrice" varchar(255 REFERENCES products(price)
      );
    `)
  
  console.log("Finished building tables!");
  } catch (error){
      console.log("Error building Tables!");
      throw error;
  }
  
  }

  async function createInitialUsers() {
    console.log("Starting to create users...")
    try {
      const usersToCreate = [
        { username: "albert", password: "bertie99", streetAddress: "501 S Main", city: "Littlerock", state: "AR",
        zip: "71820", phone: "(479)555-5555", email: "albert@gmail.com"},
        { username: "sandra", password: "sandra123", streetAddress: "502 S Main", city: "Littlerock", state: "AR",
        zip: "71820", phone: "(479)555-6555", email: "sandra@gmail.com" },
        { username: "glamgal", password: "glamgal123", streetAddress: "503 S Main", city: "Littlerock", state: "AR",
        zip: "71820", phone: "(479)555-7555", email: "glamgal@gmail.com" },
      ]
      const users = await Promise.all(usersToCreate.map(createUser))
  
      console.log("Users created:")
      console.log(users)
      console.log("Finished creating users!")
    } catch (error) {
      console.error("Error creating users!")
      throw error
    }
  }
  async function createInitialProducts() {
    try {
      console.log("Starting to create products...")
  
      const productsToCreate = [
        {
          name: "Nike",
          description: "running shoe",
          category: "athletic",
          price: "49.99",
          imageUrl: ""
        },
        {
          name: "",
          description: "",
          category: "athletic",
          price: "49.99",
          imageUrl: ""
        },
        {
          name: "",
          description: "",
          category: "athletic",
          price: "49.99",
          imageUrl: ""
        },
        { name: "", 
          description: "" ,
          category: "athletic",
          price: "49.99",
          imageUrl: ""
        },

        { name: "", 
          description: "",
          category: "athletic",
          price: "49.99",
          imageUrl: ""
        },

        { name: "", 
          description: "",
          category: "athletic",
          price: "49.99",
          imageUrl: ""
        },

        { name: "", 
          description: "",
          category: "athletic",
          price: "49.99",
          imageUrl: ""
        }
      ]
      const products = await Promise.all(productsToCreate.map(createProduct))
  
      console.log("products created:")
      console.log(products)
  
      console.log("Finished creating products!")
    } catch (error) {
      console.error("Error creating products!")
      throw error
    }
  }
  


