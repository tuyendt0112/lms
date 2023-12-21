const router = require("express").Router();
const ctrls = require("../controllers/department");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.get("/all", [verifyAccessToken], ctrls.getDepartments);
router.post("/", [verifyAccessToken, isAdmin], ctrls.createDepartment);
router.delete("/:did", [verifyAccessToken, isAdmin], ctrls.deleteDepartment);
router.get("/:title", [verifyAccessToken], ctrls.getMajorByTitle);
router.put("/", [verifyAccessToken, isAdmin], ctrls.updateDepartment);
module.exports = router;
