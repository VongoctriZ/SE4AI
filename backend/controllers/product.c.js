const Product = require('../models/product.m')


// endpoint for adding products
const addProduct = async (req, res) => {
    let products = await Product.find({});
    let id;
    if (products.length > 0) {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1;
    }
    else {
        id = 1;
    }
    const product = new Product({

        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    });
    console.log(product);
    // save product in database
    await product.save();
    console.log("Saved");
    res.json({
        success: true,
        name: req.body.name,
    })
}

// create api for getting all products
const allProducts =  async (req, res) => {
    let products = await Product.find({});
    console.log("All Products fetched");
    res.send(products);
}

// create API for deleting Products
const removeProduct = async (req, res) => {
    await Product.findOneAndDelete({ id: req.body.id });
    console.log("Removed");
    res.json({
        success: true,
        name: req.body.name
    })
}

// create API for deleting all products
const removeAllProducts = async (req, res) => {
    const result = await Product.deleteMany({});
    console.log(`${result.deletedCount} products removed`);
    res.json({
        success: true,
        message: `${result.deletedCount} products removed`
    });
}

//creating endpoint for popular in women section
const popularInWomen = async (req, res) => {
    let products = await Product.find({ category: "women" });
    let popular_in_women = products.slice(0, 4);
    console.log(popular_in_women)
    console.log("Poppular in women fetched");
    res.send(popular_in_women);
}

// creating endpoint for new collection data
const newCollections = async (req, res) => {
    let products = await Product.find({});

    let new_collection = products.slice(1).slice(-8);

    res.send(new_collection);
}

module.exports = {addProduct,allProducts,removeAllProducts,removeProduct,popularInWomen,newCollections};