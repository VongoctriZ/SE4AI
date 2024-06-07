const multer = require("multer");
const path = require("path"); // Khai báo path để sử dụng path.extname

const storage = multer.diskStorage({
    destination: './upload/images', // Đường dẫn lưu trữ
    filename: (req, file, cb) => {
        // Sử dụng file.originalname thay vì file.filename
        cb(null, `${file.originalname.split('.')[0]}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
