// const port = 4000;
// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const jwt = require("jsonwebtoken");
// const cors = require("cors");
// const routes = require("./routes");
// const { upload, uploadToImgur } = require("./middleware/imgurUpload");
// // require('dotenv').config();

// // add middleware to parse JSON bodies of incoming requests.
// app.use(express.json());
// // add CORS middleware to enable cross-origin requests.
// app.use(cors());

// // Database Connection with MongoDB
// mongoose.connect("mongodb+srv://huy94:qVG1QgHHccmC3eI5@clothes.4eaglhc.mongodb.net/shoper");

// // API Creation
// app.get("/", (req, res) => {
//   res.send("Express App is running");
// });

// // Create upload endpoint for images
// app.post('/upload', upload.single('image'), async (req, res) => {

//   console.log("upload req: ", req);
//   if (!req.file) {
//     return res.status(400).json({
//       success: 0,
//       message: 'No file uploaded',
//     });
//   }

//   try {
//     const imageUrl = await uploadToImgur(req.file);
//     res.json({
//       success: 1,
//       image_url: imageUrl,
//     });
//   } catch (error) {
//     console.error('Error uploading to Imgur:', error);
//     res.status(500).json({
//       success: 0,
//       message: 'Error uploading image',
//     });
//   }
// });

// // Routes 
// routes(app);

// // server listening
// app.listen(port, (error) => {
//   if (!error) {
//     console.log("Server Running on Port " + port);
//   } else {
//     console.log("Error: " + error);
//   }
// });

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
