const router = require("express").Router()
const ctrls = require("../controllers/notification")
const {
    verifyAccessToken,
    isAdmin,
    isAdminAndPitchOwn,
} = require("../middlewares/verifyToken")
const uploader = require("../config/cloudinaryconfig")
router.post("/", [verifyAccessToken, isAdminAndPitchOwn], uploader.fields([{ name: "file", maxCount: 1 }]), ctrls.createNotification)
router.get("/", ctrls.getAllNotification)
router.put("/:nid", [verifyAccessToken, isAdminAndPitchOwn], ctrls.updateNotification)
router.get("/:nid", ctrls.getNotification)
router.delete("/:nid", [verifyAccessToken, isAdminAndPitchOwn], ctrls.deleteNotification)

module.exports = router