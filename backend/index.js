const port = 4000;
// import express.js framework, allow to create the server and define routes
const express = require("express");
// create an instance of the Express application
const app = express();
// import Mongoose, a MongoDB object modeling tool designed to work in an asynchronous environment
const mongoose = require("mongoose");
// import JSON Web Token (JWT) library for generating and verifying tokens for authentication
const jwt = require("jsonwebtoken");
// Import Multer, a middleware for handing multipart/form-data, primarily used for file uploads
const multer = require("multer");
// Imports the Node.js 'path' module, which provides utilities for working with file and directory paths
const path = require("path");
// Imports CORS (Cross-Origin Resource Sharing) middleware for enabling cross-origin requests.
const cors = require("cors");

const { type } = require("express/lib/response");

// add middleware to parse JSON bodes of incoming requests.
// This middleware makes 'req.body' available for JSON request payloads
app.use(express.json());
// add CORS middleware to enable cross-origin requests. This allow the frontend, hosted on a different domain or port,
// to make requests to this server.
app.use(cors());

// Database Connection with MongoDB
mongoose.connect("mongodb+srv://huy94:qVG1QgHHccmC3eI5@clothes.4eaglhc.mongodb.net/shoper")

// API Creation

app.get("/",(req,res)=>{
    res.send("Express App is running")
})

// Image Storage Engine

const storage = multer.diskStorage({
    destination: './upload/images',
    filename:(req,file,cb)=>{
        return cb(null,`${file.filename}_${Date.now()}${path.extname(file.originalname)}`)
    }
})


const upload = multer({storage:storage})

// Create upload endpoint for images

app.use('/images',express.static('upload/images'))

app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
})

// Schema for Creating Products

const Product = mongoose.model("Product",{
    id:{
        type: Number,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type: Number,
        required:true,
    },
    old_price:{
        type: Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now(),
    },
    available:{
        type:Boolean,
        default:true,
    }
})

// endpoint for adding products
app.post("/addproduct",async(req,res)=>{
    let products = await Product.find({});
    let id;
    if(products.length > 0){
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1;
    }
    else{
        id=1;
    }
    const product = new Product({
        
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    });
    console.log(product);
    // save product in database
    await product.save();
    console.log("Saved");
    res.json({
        success:true,
        name:req.body.name,
    })
})

// create API for deleting Products
app.post('/removeproduct',async (req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success:true,
        name:req.body.name
    })
})

// create api for getting all products
app.get('/allproduct',async (req,res)=>{
    let products = await Product.find({});
    console.log("All Products fetched");
    res.send(products);
})
// server listening
app.listen(port, (error) => {
    if (!error) {
        console.log("Server Running on Port " + port)
    } else {
        console.log("Error: " + error)
    }
})