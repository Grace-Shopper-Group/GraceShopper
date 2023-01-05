const http = require("http")
const express = require("express");
const app = express();
const server = http.createServer(app)

app.get("/", (req, res) => res.send("Hello World!"));

const PORT = 1337;

server.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});