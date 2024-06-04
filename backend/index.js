const port = 4000;
// import express.js framework, allow to create the server and define routes
const express = require("express");
// create an instance of the Express application
const app = express();
// import Mongoose, a MongoDB object modeling tool designed to work in an asynchronous environment
const mongoose = require("mongoose");
// import JSON Web Token (JWT) library for generating and verifying tokens for authentication
const jwt = require("jsonwebtoken");

// Imports the Node.js 'path' module, which provides utilities for working with file and directory paths
const path = require("path");
// Imports CORS (Cross-Origin Resource Sharing) middleware for enabling cross-origin requests.
const cors = require("cors");

const routes = require("./routes");

const { type } = require("express/lib/response");
const { log } = require("console");

// add middleware to parse JSON bodes of incoming requests.
// This middleware makes 'req.body' available for JSON request payloads
app.use(express.json());
// add CORS middleware to enable cross-origin requests. This allow the frontend, hosted on a different domain or port,
// to make requests to this server.
app.use(cors());

// Database Connection with MongoDB
mongoose.connect(
  "mongodb+srv://huy94:qVG1QgHHccmC3eI5@clothes.4eaglhc.mongodb.net/shoper"
);

// API Creation

app.get("/", (req, res) => {
  res.send("Express App is running");
});

// Image Storage Engine

// Create upload endpoint for images
app.use("/images", express.static("upload/images"));

const upload = require("./middleware/upload");

app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});


// Route 
routes(app);

// server listening
app.listen(port, (error) => {
  if (!error) {
    console.log("Server Running on Port " + port);
  } else {
    console.log("Error: " + error);
  }
});
