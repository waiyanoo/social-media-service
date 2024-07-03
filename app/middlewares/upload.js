const util = require("util");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const dbConfig = require("../config/db.config");
const maxSize = 4 * 1024 * 1024;

let storage = new GridFsStorage({
    url: `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const match = ["image/png", "image/jpeg"];

        if (match.indexOf(file.mimetype) === -1) {
            return `${Date.now()}-d-360-${file.originalname}`;
        }

        return {
            bucketName: dbConfig.imgBucket,
            filename: `${Date.now()}-d-360-${file.originalname}`
        };
    }
});

let uploadFile = multer({
    storage: storage,
    limits: { fileSize: maxSize },
}).single("file");
let uploadFilesMiddleware = util.promisify(uploadFile);
module.exports = uploadFilesMiddleware;
