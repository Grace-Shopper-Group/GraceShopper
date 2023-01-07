
const client = require("./client");

async function createUser({ username, password, streetAddress, city, state, zip, phone, email }) {
  try {
    const { rows } = await client.query(`
      INSERT INTO users(username, password, "streetAddress", city, state, zip, phone, email) 
      VALUES($1, $2, $3, $4, $5, $6, $7, $8) 
      ON CONFLICT (username) DO NOTHING 
      RETURNING *;
    `, [username, password, streetAddress, city, state, zip, phone, email]);

    return rows;
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
    const { rows: [ user ] } = await client.query(`
      SELECT *
      FROM users
      WHERE id=${ username}
    `);
    return user;
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



module.exports = {
  createUser,
  getUserById,
  getUserByUsername,
  getAllUsers
}