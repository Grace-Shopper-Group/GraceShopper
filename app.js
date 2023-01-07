const http = require("http")
const express = require("express");
const app = express();
const router = require('./api');
const server = http.createServer(app)
const { client } = require('./db');
const morgan = require('morgan');
app.use(morgan('dev'));

server.use(express.json())


client.connect();

server.use('/api', (req, res, next) => {
    console.log("A request was made to /api");
    next();
  });

server.use('/api', router);

server.get("/", (req, res) => res.send("Hello World!"));

const PORT = 1337;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});