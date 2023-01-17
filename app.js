const http = require("http")
//require("dotenv").config()
const express = require("express");

const app = express();
const morgan = require('morgan');
const cors = require ('cors')

const router = require('./api');


app.use(morgan('dev'));
// app.use(cors());



app.use(cors({
origin: '*',
methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
allowedHeaders: "Content-Type, Authorization",
credentials: true
}));
app.options('*', cors());

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//   next();
// });


app.use('/api', router) 

router.use('/api', (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" ); 
    console.log("A request was made to /api");
    next();
  });


router.get("/", (req, res) => {
res.setHeader("Access-Control-Allow-Origin", "*")
res.setHeader("Access-Control-Allow-Credentials", "true");
res.setHeader("Access-Control-Max-Age", "1800");
res.setHeader("Access-Control-Allow-Headers", "content-type");
res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" ); 
res.send("Hello World!")});

router.use((error, req, res, next) => {
    console.error(error);
   res.status(404);
    res.send("That page was not found.");
    next()
  });

const PORT = 3000
const server = http.createServer(app)

server.listen(PORT, () => {
  console.log(`Server is listening in port ${PORT}`);
});

