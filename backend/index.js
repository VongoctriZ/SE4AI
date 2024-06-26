const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes");
const { upload, uploadToImgur } = require("./middleware/imgurUpload");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware to parse JSON bodies
app.use(express.json());
// CORS middleware
app.use(cors());

// Database Connection with MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Error connecting to MongoDB:', error));

// Health check for Imgur API
const checkImgurAPI = async () => {
  try {
    const response = await axios.get('https://api.imgur.com/3/credits', {
      headers: {
        Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
      },
    });
    return response.status === 200;
  } catch (error) {
    console.error('Error checking Imgur API:', error.response ? error.response.data : error.message);
    return false;
  }
};

// Health check endpoint
app.get('/health/imgur', async (req, res) => {
  const isImgurAPIAlive = await checkImgurAPI();
  if (isImgurAPIAlive) {
    res.status(200).json({ success: 1, message: 'Imgur API is alive' });
  } else {
    res.status(500).json({ success: 0, message: 'Imgur API is down' });
  }
});

// Example root route
app.get('/', (req, res) => {
  res.send('Express App is running');
});

// Create upload endpoint for images
app.post('/upload', upload.single('image'), async (req, res) => {
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

// Server listening
app.listen(port, (error) => {
  if (!error) {
    console.log('Server running on port ' + port);
  } else {
    console.log('Error: ' + error);
  }
});
