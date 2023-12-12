const Booking = require("../models/booking");
const User = require("../models/user");
const Pitch = require("../models/pitch");
const Coupon = require("../models/coupon");
const asyncHandler = require("express-async-handler");
const booking = require("../models/booking");
const mongoose = require("mongoose");
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
    const result = await Booking.create(createData);
    return res.status(200).json({
        success: result ? true : false,
        Booking: result ? result : "Cannot create booking",
    });
});

const updateStatusBooking = asyncHandler(async (req, res) => {
    const { _id, status } = req.body;

    // const status = "Success";
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

const deleteBooking = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    const response = await Booking.findByIdAndDelete(bid);
    return res.status(200).json({
        success: response ? true : false,
        message: response ? "Deleted" : "Cannot delete booking",
    });
});
const getPitchObjectIdByName = async (pitchName) => {
    const pitch = await Pitch.findOne({ title: pitchName }).select("_id");
    return pitch ? pitch._id : null;
};
const getBookingsOwner = asyncHandler(async (req, res) => {
    //   const { uid } = req.params;
    const queries = { ...req.query };

    // Tách các trường đặc biệt ra khỏi query
    const excludeFields = ["limit", "sort", "page", "fields"];
    excludeFields.forEach((el) => delete queries[el]);

    // Format lại các operators cho đúng cú pháp mongoose
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(
        /\b(gte|gt|lt|lte)\b/g,
        (matchedEl) => `$${matchedEl}`
    );
    let formattedQueries = JSON.parse(queryString);
    if (req.query.q) {
        // Thêm điều kiện tìm kiếm theo tên sân
        // console.log("có q", queries);
        // delete formartedQueries.q;
        formattedQueries = { status: { $regex: queries.q, $options: "i" } };
    }
    if (req.query.qpitch) {
        // console.log("có pitch", req.query.qpitch);
        const pitchObjectId = await getPitchObjectIdByName(queries.qpitch);
        // if (!pitchObjectId) {
        //   console.log("Pitch not found for the given name.");
        // }

        // formattedQueries.qpitch = pitchObjectId;
        formattedQueries["$and"] = [
            { pitch: pitchObjectId },
            //   { total: { $regex: queries.q, $options: "i" } },
            //   { shift: { $regex: queries.q, $options: "i" } },
            //   { bookedData: { $regex: queries.q, $options: "i" } },
        ];
        delete formattedQueries.qpitch;
    }
    // console.log(formattedQueries);
    //   if (req.query.owner) {
    //     console.log("halo");
    //     formattedQueries["$and"] = [{ owner: queries?.owner }];
    //   }
    if (queries?.owner) {
        formattedQueries["owner"] = queries?.owner;
    }
    let queryCommand = Booking.find(formattedQueries)
        .populate({
            path: "bookingBy",
            select: "firstname lastname ",
        })
        .populate({
            path: "pitch",
            select: "title thumb owner",
        });
    // Sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        queryCommand = queryCommand.sort(sortBy);
    }

    // Fields limiting
    if (req.query.fields) {
        const fields = req.query.fields.split(",").join(" ");
        queryCommand = queryCommand.select(fields);
    }

    // Pagination
    const page = +req.query.page || 1;
    const limit = +req.query.limit || process.env.LIMIT_BOOKINGS;
    const skip = (page - 1) * limit;
    queryCommand.skip(skip).limit(limit);

    // Execute query
    queryCommand.exec(async (err, response) => {
        if (err) throw new Error(err.message);

        const counts = await Booking.find(formattedQueries).countDocuments();
        return res.status(200).json({
            success: response ? true : false,
            Bookings: response ? response : "Cannot get pitch",
            totalCount: counts,
        });
    });
});
const getBookings = asyncHandler(async (req, res) => {
    const queries = { ...req.query };

    // Tách các trường đặc biệt ra khỏi query
    const excludeFields = ["limit", "sort", "page", "fields"];
    excludeFields.forEach((el) => delete queries[el]);

    // Format lại các operators cho đúng cú pháp mongoose
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(
        /\b(gte|gt|lt|lte)\b/g,
        (matchedEl) => `$${matchedEl}`
    );
    let formattedQueries = JSON.parse(queryString);
    if (req.query.q) {
        // Thêm điều kiện tìm kiếm theo tên sân
        // console.log("có q", queries);
        // delete formartedQueries.q;
        formattedQueries = { status: { $regex: queries.q, $options: "i" } };
    }
    if (req.query.qpitch) {
        // console.log("có pitch", req.query.qpitch);
        const pitchObjectId = await getPitchObjectIdByName(queries.qpitch);
        // if (!pitchObjectId) {
        //   console.log("Pitch not found for the given name.");
        // }

        // formattedQueries.qpitch = pitchObjectId;
        formattedQueries["$and"] = [
            { pitch: pitchObjectId },
            //   { total: { $regex: queries.q, $options: "i" } },
            //   { shift: { $regex: queries.q, $options: "i" } },
            //   { bookedData: { $regex: queries.q, $options: "i" } },
        ];
        delete formattedQueries.qpitch;
    }
    // console.log(formattedQueries);

    let queryCommand = Booking.find(formattedQueries)
        .populate({
            path: "bookingBy",
            select: "firstname lastname",
        })
        .populate({
            path: "pitch",
            select: "title thumb",
        });
    // Sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        queryCommand = queryCommand.sort(sortBy);
    }

    // Fields limiting
    if (req.query.fields) {
        const fields = req.query.fields.split(",").join(" ");
        queryCommand = queryCommand.select(fields);
    }

    // Pagination
    const page = +req.query.page || 1;
    const limit = +req.query.limit || process.env.LIMIT_BOOKINGS;
    const skip = (page - 1) * limit;
    queryCommand.skip(skip).limit(limit);

    // Execute query
    queryCommand.exec(async (err, response) => {
        if (err) throw new Error(err.message);

        const counts = await Booking.find(formattedQueries).countDocuments();
        return res.status(200).json({
            success: response ? true : false,
            Bookings: response ? response : "Cannot get pitch",
            totalCount: counts,
        });
    });
});
const getAllOrderByAdmin = asyncHandler(async (req, res) => {
    const response = await Booking.find();
    return res.json({
        success: response ? true : false,
        allOrder: response ? response : "Can not get data",
    });
});

module.exports = {
    createBooking,
    updateStatusBooking,
    getUserBooking,
    getBookings,
    deleteBooking,
    getUserBookingStatus,
    getBookingsOwner,
    getAllOrderByAdmin,
};
