const multer = require("multer");


const uploadSingleImage =(req, res, next) =>{
    const uploadFiles = multer({storage:multer.memoryStorage()}).single('file'); //'image' = the input name  in will be in the form
    uploadFiles(req, res, err => {
        if (err instanceof multer.MulterError) {
            if (err.code === "LIMIT_UNEXPECTED_FILE") {
                res.status(500).send({
                    message: `File size too big.}`,
                });
            }
        } else if (err) {
            res.status(500).send({
                message: `Could not upload the file: . ${err}`,
            });
        }
        next();
    });
}

const uploadHelper = {
    uploadSingleImage
};

module.exports = uploadHelper;
