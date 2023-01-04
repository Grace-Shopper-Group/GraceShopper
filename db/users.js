const client = require("./client");

const bcrypt = require('bcrypt');

async function createUser({...fields}) {

    // console.log (fields)
     const {username, password, streetAddress, city, state, zip, phone, email} = fields
     //console.log (username, password)
     const SALT_COUNT = 10;
     const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
   
     try {
       const { rows: [user] } = await client.query(`
       INSERT INTO users (username, password) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (username) DO NOTHING
       RETURNING id, username;
       `, [username, hashedPassword, streetAddress, city, state, zip, phone, email]);
       
   //console.log (user)
       return user
   }catch (error) {
       console.log ("Error in createUser function")
       throw error;
   }
   
   }





   module.exports = {
    createUser,
    
  }
  