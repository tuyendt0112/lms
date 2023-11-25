const router = require("express").Router();
const ctrls = require("../controllers/department");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/create", [verifyAccessToken, isAdmin], ctrls.createDepartment);

module.exports = router;
