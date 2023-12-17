const router = require("express").Router();
const ctrls = require("../controllers/department");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/", [verifyAccessToken, isAdmin], ctrls.createDepartment);
router.get("/", [verifyAccessToken, isAdmin], ctrls.getDepartment);

module.exports = router;
