const express = require("express");
const { JWT_SECRET } = process.env
const productsRouter = express.Router();
const { getAllProducts, createProduct, getUserByUsername, updateProduct } = require("../db");

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
    
    const { brand, description, category, price, img } = req.body;
    
    const updateData = { id: req.params.productId };
    
    if (brand){updateData.brand = brand};

    if (description){updateData.description = description};

    if (category){updateData.category = category};

    if (price){updateData.price = price};
    
    if (img){updateData.img = img};

    const prefix = 'Bearer'
    const auth = req.header('Authorization')
    
    if (!auth){
        res.status(401)
        res.send({
            error: "Error",
            name: "Token Error",
            message: "You must be logged in to perform this action"
        })}

    const token = auth.slice(prefix.length);

    const tokenVerified = jwt.verify(token, JWT_SECRET)

        console.log("token id:", tokenVerified.id)

    try {

        const changedProduct = await updateProduct(req.params.productId, updateData)

        if (!changedProduct) {
            res.send({
                name: "Error",
                error: "Could not update the product",
                message: `Product ${updateData.id} not found`
            });
        } else if (changedProduct.error) {
            res.send({
                name: "Error",
                error: changedProduct.error,
                message: `An product with name ${req.body.name} already exists`
            })
        } else {
            res.send(changedProduct)
        }

    } catch (error){
        next(error)
    }


});

productsRouter.delete("/:productId", async (req, res) => {
    const user = req.user
    const productId = req.params


});

module.exports = productsRouter;
