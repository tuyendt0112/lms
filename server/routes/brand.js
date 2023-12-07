const router = require("express").Router();
const controllers = require("../controllers/brand");
const {
    verifyAccessToken,
    isAdmin,
    isAdminAndPitchOwn,
} = require("../middlewares/verifyToken");
const uploader = require("../config/cloudinaryconfig");
// Quest
router.get("/", controllers.getBrands);
router.put("/ratings", [verifyAccessToken], controllers.ratings);
//User
// PitchOwner

router.get(
    "/:userId",
    [verifyAccessToken, isAdminAndPitchOwn],
    controllers.getBrandByOwner
);
// Admin
router.put(
    "/uploadimage/:brandId",
    [verifyAccessToken, isAdminAndPitchOwn],
    uploader.array("images", 10),
    controllers.uploadImagesBrand
);
router.post(
    "/",
    [verifyAccessToken, isAdminAndPitchOwn],
    uploader.fields([
        { name: "images", maxCount: 10 },
        { name: "thumb", maxCount: 1 },
    ]),
    controllers.createBrand
);
router.put(
    "/:brandId",
    [verifyAccessToken, isAdminAndPitchOwn, isAdmin],
    controllers.updateBrand
);
router.delete(
    "/:brandId",
    [verifyAccessToken, isAdminAndPitchOwn, isAdmin],
    controllers.deleteBrand
);
router.put(
    "/address/:brandId",
    [verifyAccessToken, isAdminAndPitchOwn],
    controllers.updateBrandAddress
);
router.put(
    "/description/:brandId",
    [verifyAccessToken, isAdminAndPitchOwn],
    controllers.updateBrandDescription
);
module.exports = router;