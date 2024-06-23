const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const routes = require("./routes");
const { upload, uploadToImgur } = require("./middleware/imgurUpload");
// require('dotenv').config();

// add middleware to parse JSON bodies of incoming requests.
app.use(express.json());
// add CORS middleware to enable cross-origin requests.
app.use(cors());

// Database Connection with MongoDB
mongoose.connect("mongodb+srv://huy94:qVG1QgHHccmC3eI5@clothes.4eaglhc.mongodb.net/shoper");

// API Creation
app.get("/", (req, res) => {
  res.send("Express App is running");
});

// Create upload endpoint for images
app.post('/upload', upload.single('image'), async (req, res) => {

  console.log("upload req: ", req);
  if (!req.file) {
    return res.status(400).json({
      success: 0,
      message: 'No file uploaded',
    });
  }

  try {
    const imageUrl = await uploadToImgur(req.file);
    res.json({
      success: 1,
      image_url: imageUrl,
    });
  } catch (error) {
    console.error('Error uploading to Imgur:', error);
    res.status(500).json({
      success: 0,
      message: 'Error uploading image',
    });
  }
});

// Routes 
routes(app);

// server listening
app.listen(port, (error) => {
  if (!error) {
    console.log("Server Running on Port " + port);
  } else {
    console.log("Error: " + error);
  }
});
