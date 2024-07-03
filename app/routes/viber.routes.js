const controller = require("../controllers/viber.controller");
const {uploadHelper} = require("../middlewares");
module.exports = function(app) {
    app.get("/api/viber/getChannelInfo", controller.getChannelInfo);
    app.post("/api/viber/postContent", [uploadHelper.uploadSingleImage], controller.postContent)
}
