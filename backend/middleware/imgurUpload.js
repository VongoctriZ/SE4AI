// middleware/imgurUpload.js
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadToImgur = async (file) => {
    const formData = new FormData();
    formData.append('image', file.buffer.toString('base64'));

    const response = await axios.post('https://api.imgur.com/3/upload', formData, {
        headers: {
            Authorization: `Client-ID 2aab1d5c6464a1b`,
            ...formData.getHeaders(),
        },
    });

    return response.data.data.link;
};

module.exports = { upload, uploadToImgur };
