const router = require("express").Router();
const controllers = require("../controllers/brand");
const {
    verifyAccessToken,
    isAdmin,
    isAdminAndPitchOwn,
} = require("../middlewares/verifyToken");
const uploader = require("../config/cloudinaryconfig");
// Quest
router.get("/", controllers.getBrand);
router.put("/ratings", [verifyAccessToken], controllers.ratings);
//User
// PitchOwner

router.get(
    "/all",
    [verifyAccessToken, isAdminAndPitchOwn],
    controllers.getAllBrands
);
router.get(
    "/:userId",
    [verifyAccessToken, isAdminAndPitchOwn],
    controllers.getBrandByOwner
);
router.get("/title/:btitle", controllers.getBrandByTitle);
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
    "/",
    [verifyAccessToken, isAdminAndPitchOwn],
    uploader.fields([
        { name: "images", maxCount: 10 },
        { name: "thumb", maxCount: 1 },
    ]),
    controllers.updateBrand
);
router.delete(
    "/:bid",
    [verifyAccessToken, isAdminAndPitchOwn],
    controllers.deleteBrand
);
router.put(
    "/address/:brandId",
    [verifyAccessToken, isAdminAndPitchOwn],
    controllers.updateBrandAddress
);
router.get(
    "/all",
    [verifyAccessToken, isAdminAndPitchOwn],
    controllers.getAllBrands
);
router.put(
    "/description/:brandId",
    [verifyAccessToken, isAdminAndPitchOwn],
    controllers.updateBrandDescription
);
module.exports = router;