const router = require("express").Router();
const ctrls = require("../controllers/major");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/create", [verifyAccessToken, isAdmin], ctrls.createMajor);
// router.put("/finalregister/:token", ctrls.finalRegister);
module.exports = router;
