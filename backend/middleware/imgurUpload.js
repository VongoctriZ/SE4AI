// // middleware/imgurUpload.js
// const multer = require("multer");
// const axios = require("axios");
// const FormData = require("form-data");

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// const uploadToImgur = async (file) => {
//     const formData = new FormData();
//     formData.append('image', file.buffer.toString('base64'));

//     const response = await axios.post('https://api.imgur.com/3/upload', formData, {
//         headers: {
//             Authorization: `Client-ID 2aab1d5c6464a1b`,
//             ...formData.getHeaders(),
//         },
//     });

//     return response.data.data.link;
// };

// module.exports = { upload, uploadToImgur };


// middleware/imgurUpload.js
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

// Multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Accept image files only
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    },
});

// Function to upload image to Imgur
const uploadToImgur = async (file) => {
    try {
        const formData = new FormData();
        formData.append('image', file.buffer.toString('base64'));

        const response = await axios.post('https://api.imgur.com/3/image', formData, {
            headers: {
                Authorization: `Client-ID 2aab1d5c6464a1b`,
                ...formData.getHeaders(),
            },
        });

        return response.data.data.link;
    } catch (error) {
        console.error('Error uploading to Imgur:', error.message);
        throw new Error('Failed to upload image to Imgur');
    }
};

module.exports = { upload, uploadToImgur };
