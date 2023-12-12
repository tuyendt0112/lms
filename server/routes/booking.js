const router = require("express").Router();
const ctrls = require("../controllers/booking");
const {
    verifyAccessToken,
    isAdmin,
    isAdminAndPitchOwn,
} = require("../middlewares/verifyToken");
const uploader = require("../config/cloudinaryconfig");

router.post("/", verifyAccessToken, ctrls.createBooking);
router.put("/status", [verifyAccessToken], ctrls.updateStatusBooking);
router.get("/all", [verifyAccessToken, isAdmin], ctrls.getBookings);
router.get(
    "/all-order",
    [verifyAccessToken, isAdmin],
    ctrls.getAllOrderByAdmin
);
router.get(
    "/all-pitchowner",
    [verifyAccessToken, isAdminAndPitchOwn],
    ctrls.getBookingsOwner
);
router.get("/get-order/:userId", verifyAccessToken, ctrls.getUserBookingStatus);
router.delete("/:bid", verifyAccessToken, ctrls.deleteBooking);
router.get("/:userId", verifyAccessToken, ctrls.getUserBooking);

module.exports = router;