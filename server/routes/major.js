const router = require("express").Router();
const ctrls = require("../controllers/major");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/create", [verifyAccessToken, isAdmin], ctrls.createMajor);

module.exports = router;
