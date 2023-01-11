const express = require("express");
const { nextTick } = require("process");
const productsRouter = express.Router();
const { getAllProducts, createProduct, getUserByUsername } = require("../db");

productsRouter.get("/", async (req, res, next) => {
  const allProducts = await getAllProducts();

  if (allProducts) {
    console.log("allProducts", allProducts);
  }
  res.send(allProducts);
  next();
});

productsRouter.post("/", async (req, res) => {
  const user = req.user;
  const { brand, description, category, price, img } = req.body;

  const validUser = await getUserByUsername(user.username);

  if (validUser) {
    try{
    const newProduct = await createProduct(
      brand,
      description,
      category,
      price,
      img
    );

    res.send(newProduct);

    } catch ({name, message}) {
        next({name, message})
    }
  } else {
    res.status(401)
    res.send({
        error: "Error",
        name: "Must be logged in error.",
        message: "Must be logged in to perform this action"
  })
  }
});

productsRouter.patch("/:productId", async (req, res) => {
    const user = req.user
    const productId = req.params




});

productsRouter.delete("/:productId", async (req, res) => {
    const user = req.user
    const productId = req.params


});

module.exports = productsRouter;
