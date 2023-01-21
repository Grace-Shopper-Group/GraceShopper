const express = require("express");
const { JWT_SECRET } = process.env
const jwt = require("jsonwebtoken")
const router = express.Router();
const { getAllProducts, createProduct, getUserByUsername, updateProduct } = require("../db");

router.get("/", async (req, res, next) => {
  const allProducts = await getAllProducts();

  if (allProducts) {
    console.log("allProducts", allProducts);
  }
  res.send(allProducts);
  next();
});

router.post("/", async (req, res, next) => {
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

router.patch("/:productId", async (req, res, next) => {
    
    const { brand, description, category, price, img } = req.body;
    
    const updateData = { id: req.params.productId };
    
    if (brand){updateData.brand = brand};

    if (description){updateData.description = description};

    if (category){updateData.category = category};

    if (price){updateData.price = price};
    
    if (img){updateData.imageUrl = img};

    const prefix = 'Bearer '
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

router.delete("/:productId", async (req, res, next) => {
    try {
        const { productId } = req.params;
        const { authorization } = req.headers;

        if (!authorization) {
            res.status(403)
            res.send({
              error: "Not Authorized",
              message: `User is not allowed to delete product`,
              name: "Auth Error"
            })
        } else {
            const deletedProduct = await deleteProduct(productId);
            res.send(deletedProduct);
        }
    } catch (error) {
        next(error)
    }

});

module.exports = router;
