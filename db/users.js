
const client = require("./client");
const bcrypt = require('bcrypt');

async function createUser({ username, password}) {
  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
console.log ("hashedPassword", hashedPassword)
console.log (username, password)
  try {
    const { rows: [user] } = await client.query(`
      INSERT INTO users(username, password) 
      VALUES($1, $2) 
      ON CONFLICT (username) DO NOTHING 
      RETURNING *;
    `, [username, hashedPassword]);

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
  console.log ("getUserByUsername1", username)
  try {
    const { rows: user } = await client.query(`
      SELECT *
      FROM users
      WHERE username=$1
    `,[username]);
    console.log ("aftersqluser, user",user)
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
     console.log ("getUser2 username, password2", username, password)
     const user = await getUserByUsername(username)
     console.log ("getUserbyUsername2", user)
     if (user){
     const hashedPassword = user.password
    
     const passwordsMatch = await bcrypt.compare(password, hashedPassword);
     if (passwordsMatch) {
      delete user.password;
      console.log("getUserbyUsernaem3", user)
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