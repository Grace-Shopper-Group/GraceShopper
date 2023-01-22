const express = require("express");
const { JWT_SECRET } = process.env
const jwt = require("jsonwebtoken")
const router = express.Router();
const { getAllProducts, createProduct, getUserByUsername, updateProduct, deleteProduct } = require("../db");

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
    const { productId } = req.params;

    try {
    const deletedProduct = await deleteProduct(productId);
        res.send(deletedProduct);
        
    } catch (error) {
        next(error)
    }

});

module.exports = router;
