const router = require("express").Router();
const ctrls = require("../controllers/booking");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploader = require("../config/cloudinaryconfig");

// Quest

// User

router.post("/", verifyAccessToken, ctrls.createBooking);
// Admin

router.put("/status", [verifyAccessToken], ctrls.updateStatusBooking);
router.get("/all", [verifyAccessToken, isAdmin], ctrls.getBookings);
router.get("/get-order/:userId", verifyAccessToken, ctrls.getUserBookingStatus);
router.delete("/:bookingId", verifyAccessToken, ctrls.deleteBooking);
router.get("/:userId", verifyAccessToken, ctrls.getUserBooking);
module.exports = router;