const express = require('express');

const router = express.Router();


const {getUserByUsername, createUser, getUserById, getUser } = require('../db/users');

const jwt = require('jsonwebtoken');
const  {JWT_SECRET}= process.env;


const {requireUser}= require('./utils');



router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  

  if (!username || !password) {
      next({
          name: "MissingCredentialsError",
          message: "Please supply a valid username and password"
      });
  }
  try{
      console.log (username, password)
      const user = await getUser({username, password});
      console.log ("user", user)
    
     
      if (user) {
          const token = jwt.sign({
            id: user.id,
            username: username
        }, JWT_SECRET);
        
        delete user.password
        user.token = token
        req.user = user
        const response = { 
          user: user, 
          message: "you're logged in!",
          token: token
        }
       console.log ("token", token)
        res.send( response );
        } else {
          res.status(401)
          res.send({
              name: 'IncorrectCredentialsError',
              message: 'Username or password is incorrect'
          });
        }
      } catch(error) {
          console.log(error);
          next(error);
      }
  res.end();
});

router.post('/register', async (req, res, next) => {
  console.log ("req.body",req.body)
  const { username, password } = req.body;
  
  if (password.length < 8){
  
  res.status(401)
      res.send({ 
        error: "Error",
        name: "Password length error",
        message: "Password Too Short!"})
  }
 
 try {

  const _user = await getUserByUsername(username);
  console.log("_user", _user)

  if (_user && _user.username === username) {
    res.status(403)
    res.send({ 
      error: "Error",
      name: "Username error",
      message: `User ${username} is already taken.`})
  }
     
     const fields= {username: username, password: password}
    console.log ("fields", fields)
      const user = await createUser(
        fields
      );
     console.log ("aftercreateUser", user)
      const token = jwt.sign({
          "id": user.id,
          "username": username
      }, process.env.JWT_SECRET, {
          expiresIn: '2w'
      });
        console.log (token)
          const response = { "user": user, 
          "message": "you're signed up!", "token": token}
       
      res.send( response );
      }catch(error) {
      console.error; 
      console.log ("Error in router.post /registration");
      next();
  }
});


router.get('/:username/cart', requireUser, async (req, res, next) => {

  const { userId } = req.params;
  
  if (userId) {
    try {
      const cart = await getCartByUserId({userId});
     
      res.send(cart)
    }catch ({ name, message }) {
      next({ name, message });
    }
  }
  });


  module.exports = router;