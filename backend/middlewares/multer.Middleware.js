import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public"); // saves to root-level /public folder
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // keep the original file name
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB max
    },
});

export default upload;
