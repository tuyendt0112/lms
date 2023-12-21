const router = require("express").Router();
const ctrls = require("../controllers/major");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/", [verifyAccessToken, isAdmin], ctrls.createMajor);
router.get("/all", [verifyAccessToken], ctrls.getAllMajor);
router.delete("/:mid", [verifyAccessToken, isAdmin], ctrls.deleteMajor);
module.exports = router;
