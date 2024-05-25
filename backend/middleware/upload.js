// Import Multer, a middleware for handing multipart/form-data, primarily used for file uploads
const multer = require("multer");

const storage = multer.diskStorage({
    destination: '../upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.filename}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({ storage: storage });

module.exports = upload;