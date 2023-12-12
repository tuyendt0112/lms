const router = require("express").Router();
const ctrls = require("../controllers/pitchCategory");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploader = require("../config/cloudinaryconfig");

router.post(
    "/",
    [verifyAccessToken, isAdmin],
    uploader.fields([{ name: "thumb", maxCount: 1 }]),
    ctrls.createCategory
);
router.get("/", ctrls.getCategories);
router.get("/all", ctrls.getAllCategories);
router.put(
    "/uploadimage/:pcid",
    [verifyAccessToken, isAdmin],
    uploader.array("images", 10),
    ctrls.uploadImagesCategories
);
router.put(
    "/:pcid",
    [verifyAccessToken, isAdmin],
    uploader.fields([{ name: "thumb", maxCount: 1 }]),
    ctrls.updateCategory
);
router.delete("/:pcid", [verifyAccessToken, isAdmin], ctrls.deleteCategory);

module.exports = router;