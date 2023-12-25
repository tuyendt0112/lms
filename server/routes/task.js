const router = require("express").Router();
const ctrls = require("../controllers/task");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploader = require("../config/cloudinaryconfig")


router.post("/", [verifyAccessToken, isAdmin], ctrls.createTask);
router.get("/", ctrls.getTasks);
router.put('/:tid', [verifyAccessToken], uploader.fields([{ name: "file", maxCount: 1 }]), ctrls.updateTask)
router.delete('/:tid', [verifyAccessToken, isAdmin], ctrls.deleteTask)

module.exports = router;
