const client = require("./client");
const {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
} = require("./users");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} = require("./products");

const { addProductToCart } = require("./cart");

async function dropTables() {
  // drop all tables, in the correct order

  try {
    console.log("Starting to drop tables...");

    await client.query(`
      DROP TABLE IF EXISTS orders CASCADE;
      DROP TABLE IF EXISTS cart CASCADE;
      DROP TABLE IF EXISTS products CASCADE;
      DROP TABLE IF EXISTS users;
  `);

    console.log("Finished dropping tables!");
  } catch (error) {
    console.log("Error dropping tables!");
    throw error;
  }
}

async function createTables() {
  // create all tables, in the correct order

  try {
    console.log("Starting to build tables...");

    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username varchar(255) UNIQUE NOT NULL,
        password varchar(255) NOT NULL,
        iscustomer BOOLEAN DEFAULT false,
        firstname varchar (255),
        lastname varchar (255),
        "streetAddress" varchar (255),
        city varchar (255),
        state varchar (255),
        zip varchar (255),
        phone varchar (255),
        email varchar (255)
      );
        CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        brand varchar(255) NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        price varchar (255) NOT NULL,
        "imageUrl" varchar (255) NOT NULL
      );
        CREATE TABLE cart (
        id SERIAL PRIMARY KEY,
        quantity INTEGER NOT NULL,
        "userId" INTEGER REFERENCES users(id),
        "productId" INTEGER REFERENCES products(id),
        UNIQUE("productId", "userId")
      );
        CREATE TABLE orders (
        "orderId" SERIAL PRIMARY KEY,
        quantity INTEGER NOT NULL,
        "userId" INTEGER REFERENCES users(id),
        "productId" INTEGER REFERENCES products(id),
        total INTEGER NOT NULL,
        "orderDate" varchar (255),
        UNIQUE("orderId", "userId")
      );
       
    `);

    console.log("Finished building tables!");
  } catch (error) {
    console.log("Error building Tables!");
    throw error;
  }
}

async function createInitialUsers() {
  console.log("Starting to create users...");
  try {
    const usersToCreate = [
      {
        username: "albert",
        password: "bertie99",
        // streetAddress: "501 S Main",
        // city: "Littlerock",
        // state: "AR",
        // zip: "71820",
        // phone: "(479)555-5555",
        // email: "albert@gmail.com",
      },
      {
        username: "sandra",
        password: "sandra123",
        // streetAddress: "502 S Main",
        // city: "Littlerock",
        // state: "AR",
        // zip: "71820",
        // phone: "(479)555-6555",
        // email: "sandra@gmail.com",
      },
      {
        username: "glamgal",
        password: "glamgal123",
        // streetAddress: "503 S Main",
        // city: "Littlerock",
        // state: "AR",
        // zip: "71820",
        // phone: "(479)555-7555",
        // email: "glamgal@gmail.com",
      },
    ];
    const users = await Promise.all(usersToCreate.map(createUser));

    console.log("Users created:");
    console.log(users);
    console.log("Finished creating users!");
  } catch (error) {
    console.error("Error creating users!");
    throw error;
  }
}
async function createInitialProducts() {
  try {
    console.log("Starting to create products...");

    const productsToCreate = [
      {
        brand: "Adidas",
        description: "Men's Run 70s Sneaker",
        category: "athletic",
        price: "64.99",
        imageUrl:
          "https://www.famousfootwear.com/blob/product-images/20000/98/76/6/98766_pair_medium.jpg",
      },
      {
        brand: "Nike",
        description: "Men's Air Max Systm Sneaker",
        category: "athletic",
        price: "84.99",
        imageUrl:
          "https://www.famousfootwear.com/blob/product-images/20000/96/01/9/96019_pair_medium.jpg",
      },
      {
        brand: "Under Armour",
        description: "Men's Surge 3 Slip Running",
        category: "athletic",
        price: "64.99",
        imageUrl:
          "https://www.famousfootwear.com/blob/product-images/20000/36/24/4/36244_pair_medium.jpg",
      },
      {
        brand: "Perry Ellis Portfolio",
        description: "Men's Derrick Plain Toe Oxford",
        category: "dress",
        price: "54.99",
        imageUrl:
          "https://www.famousfootwear.com/blob/product-images/20000/97/02/2/97022_pair_medium.jpg",
      },

      {
        brand: "Florsheim",
        description: "Men's Rucci Cap Toe Oxford",
        category: "dress",
        price: "99.99",
        imageUrl:
          "https://www.famousfootwear.com/blob/product-images/20000/70/46/8/70468_pair_medium.jpg",
      },

      {
        brand: "Madden",
        description: "Men's Alpine Dress Oxford",
        category: "dress",
        price: "49.99",
        imageUrl:
          "https://www.famousfootwear.com/blob/product-images/20000/59/63/5/59635_pair_medium.jpg",
      },

      {
        brand: "Crocs",
        description: "Men's Classic Fuzz Lined",
        category: "casual",
        price: "49.99",
        imageUrl:
          "https://www.famousfootwear.com/blob/product-images/20000/97/16/8/97168_pair_medium.jpg",
      },

      {
        brand: "Koolaburra",
        description: "Men's Graisen Slipper",
        category: "casual",
        price: "69.99",
        imageUrl:
          "https://www.famousfootwear.com/blob/product-images/20000/95/91/3/95913_pair_medium.jpg",
      },

      {
        brand: "Birkenstock",
        description: "Men's Zermatt Slipper",
        category: "casual",
        price: "64.99",
        imageUrl:
          "https://www.famousfootwear.com/blob/product-images/20000/36/84/1/36841_pair_medium.jpg",
      },
    ];
    const products = await Promise.all(productsToCreate.map(createProduct));

    console.log("products created:");
    console.log(products);

    console.log("Finished creating products!");
  } catch (error) {
    console.error("Error creating products!");
    throw error;
  }
}

async function rebuildDB() {
  try {
    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialProducts();
  } catch (error) {
    console.log("Error during rebuildDB");
    throw error;
  }
}

async function testDB() {
  try {
    console.log("Starting to TEST database...");

    console.log("Calling getUser");
    const user = await getUser("albert", "bertie99");
    console.log("Testing result getUser:", user);

    console.log("Calling getUserById with id 1");
    const userById = await getUserById(1);
    console.log("Testing Result getUserById", userById);

    console.log("Calling getUserByUsername");
    const userByUsername = await getUserByUsername("albert");
    console.log("Testing result getUserByUsername", userByUsername);

    console.log("Calling getAllProducts");
    const allProducts = await getAllProducts();
    console.log("Testing Result getAllProducts:", allProducts);

    console.log("Calling getProductById 1");
    const productById = await getProductById(1);
    console.log("Testing Result getProductById 1", productById);

    console.log("Calling updateProduct on product[1], only updating price");
    const updatedProduct = await updateProduct(1, { price: 64.99 });
    console.log("Testing Result updateProduct", updatedProduct);

    console.log("calling addProductToCart on productId[1], userId[1]");
    const addToCart = await addProductToCart({
      userId: 1,
      productId: 1,
      quantity: 2,
    });
    console.log("Testing result addToCart", addToCart);

    console.log("Finished database tests!");
  } catch (error) {
    console.log("Error testing database");
    throw error;
  }
}

module.exports = {
  rebuildDB,
  testDB,
  dropTables,
  createTables,
};
