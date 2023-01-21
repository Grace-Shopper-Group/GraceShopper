const http = require("http")
require("dotenv").config()
const express = require("express");

const app = express();
const morgan = require('morgan');
const cors = require ('cors')

app.use(express.json());
app.use(morgan('dev'));

app.use(cors({
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
}));
// app.options(cors());

const router = require('./api');

app.use('/api', router) 

router.use((req, res, next) => {
 
    console.log("A request was made to /api");
    next();
  });


router.get("/", (req, res) => {
res.send("Hello World!")});

// router.use((error, req, res, next) => {
//     console.error(error);
//    res.status(404);
//     res.send("That page was not found.");
//     next()
//   });

const PORT = process.env.PORT || 1337
// const PORT = 3001
const server = http.createServer(app)

server.listen(PORT, () => {
  console.log(`Server is listening in port ${PORT}`);
});

