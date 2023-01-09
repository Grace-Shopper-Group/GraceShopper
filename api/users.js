const express = require('express');

const usersRouter = express.Router();
const {getUserByUsername, createUser, getUserById, getUser } = require('../db/users');

const jwt = require('jsonwebtoken');
const  {JWT_SECRET}= process.env;


usersRouter.get('/', async (req,res)=> {
  res.send("/api/users tickled");
})



  module.exports = usersRouter;