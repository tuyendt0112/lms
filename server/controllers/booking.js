const Booking = require("../models/booking");
const User = require("../models/user");
const Coupon = require("../models/coupon");
const asyncHandler = require("express-async-handler");

const createBooking = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { coupon } = req.body;
    const userOrder = await User.findById(_id)
        .select("order")
        .populate("order.pitch", "title price");
    const pitches = userOrder?.order?.map((el) => ({
        pitch: el.pitch._id,
        bookedDate: el.bookedDate,
        shift: el.shift,
    }));
    let total = userOrder?.order?.reduce((sum, el) => el.pitch.price + sum, 0);
    const createData = { pitches, total, bookingBy: _id };
    if (coupon) {
        const selectedCoupon = await Coupon.findById(coupon);
        total =
            Math.round((total * (1 - +selectedCoupon?.discount / 100)) / 1000) *
            1000 || total;
        createData.total = total;
        createData.coupon = coupon;
    }
    console.log(createData);
    const result = await Booking.create(createData);
    return res.status(200).json({
        success: result ? true : false,
        Booking: result ? result : "Cannot create booking",
    });
});

const updateStatusBooking = asyncHandler(async (req, res) => {
    const { _id } = req.body;
    const status = "Success";
    if (!_id) throw new Error("Missing input");
    const response = await Booking.findByIdAndUpdate(
        _id,
        {
            status: status,
        },
        { new: true }
    );
    return res.status(200).json({
        success: response ? true : false,
        Booking: response ? response : "Cannot update status booking",
    });
});

const getUserBooking = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const response = await Booking.find({ bookingBy: userId })
        // .select("pitch")
        .populate("pitch", "title price thumb category address");
    return res.status(200).json({
        success: response ? true : false,
        Booking: response ? response : "Cannot get user booking detail",
    });
});
const getUserBookingStatus = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const status = "Pending";
    const response = await Booking.find({ bookingBy: userId, status })
        // .select("pitch")
        .populate("pitch", "title price thumb category address");
    return res.status(200).json({
        success: response ? true : false,
        Booking: response ? response : "Cannot get user booking detail",
    });
});
const getBookings = asyncHandler(async (req, res) => {
    const response = await Booking.find({});
    return res.status(200).json({
        success: response ? true : false,
        Booking: response ? response : "Cannot get all user booking detail",
    });
});
const deleteBooking = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;
    const response = await Booking.findByIdAndDelete(bookingId);
    return res.status(200).json({
        success: response ? true : false,
        message: response ? "Deleted" : "Cannot update status booking",
    });
});
module.exports = {
    createBooking,
    updateStatusBooking,
    getUserBooking,
    getBookings,
    deleteBooking,
    getUserBookingStatus,
};