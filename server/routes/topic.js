const router = require("express").Router();
const ctrls = require("../controllers/topic");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");


router.post("/", [verifyAccessToken, isAdmin], ctrls.createTopic);

module.exports = router;
