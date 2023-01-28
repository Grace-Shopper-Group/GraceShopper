const express = require('express');

const router = express.Router();


const {getUserByUsername, createUser, getUserById, getUser, updateUser } = require('../db/users');

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
      const user = await getUser({username, password});
     
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

  if (_user && _user.username === username) {
    res.status(403)
    res.send({ 
      error: "Error",
      name: "Username error",
      message: `User ${username} is already taken.`})
  }
     
     const fields= {username: username, password: password}
      const user = await createUser(
        fields
      );
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

router.patch("/:userId", async (req, res, next) => {
    
  const { first_name, last_name, streetAddress, city, state, zip, phone, email } = req.body;
  
  const updateData = { id: req.params.userId };
  
  if (first_name){updateData.first_name = first_name};

  if (last_name){updateData.last_name = last_name};

  if (streetAddress){updateData.streetAddress = streetAddress};

  if (city){updateData.city = city};
  
  if (state){updateData.state = state};

  if (zip){updateData.zip = zip};

  if (phone){updateData.phone = phone};

  if (email){updateData.email = email};

  try {

      const updatedUser = await updateUser(req.params.userId, updateData)

      if (!updatedUser) {
          res.send({
              name: "Error",
              error: "Could not update the user",
              message: `User ${updateData.id} not found`
          });
      } else if (updatedUser.error) {
          res.send({
              name: "Error",
              error: updatedUser.error,
              message: `An user with name ${req.body.first_name} already exists`
          })
      } else {
          res.send(updatedUser)
      }

  } catch (error){
      next(error)
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
