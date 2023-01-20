
const client = require("./client");
const bcrypt = require('bcrypt');

async function createUser({ username, password, streetAddress, city, state, zip, phone, email}) {
  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  
  try {
    const { rows: [user] } = await client.query(`
      INSERT INTO users(username, password, "streetAddress", city, state, zip, phone, email) 
      VALUES($1, $2, $3, $4, $5, $6, $7, $8) 
      ON CONFLICT (username) DO NOTHING 
      RETURNING *;
    `, [username, hashedPassword, streetAddress, city, state, zip, phone, email]);

    console.log ("rows,", user)
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const { rows: [ user ] } = await client.query(`
      SELECT *
      FROM users
      WHERE id=${ userId }
    `);
    return user;
  } catch (error) {
    throw error;
  }
}


async function getUserByUsername(username) {
  try {
    const { rows: user } = await client.query(`
      SELECT *
      FROM users
      WHERE username=$1
    `,[username]);
    return user[0];
  } catch (error) {
    throw error;
  }
}

async function getAllUsers() {
  try {
    const { rows } = await client.query(`
      SELECT *
      FROM users;
    `);

    return rows;
  } catch (error) {
    throw error;
  }
}

async function getUser({username, password}) {
 console.log ("getUser1 username, password", username, password)

   if (!username || !password){
     return
   }
   try {
     const user = await getUserByUsername(username)
    
     if (user){
     const hashedPassword = user.password
    
     const passwordsMatch = await bcrypt.compare(password, hashedPassword);
     if (passwordsMatch) {
      delete user.password;
     
      return user
     }
    } else {
       return null;
     }
 
    } catch (error) {
     console.log ("Error in getUser")
     throw error;
   }
 }

module.exports = {
  createUser,
  getUserById,
  getUserByUsername,
  getAllUsers,
  getUser
}
