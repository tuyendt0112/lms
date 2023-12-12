const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var bookingSchema = new mongoose.Schema({
    pitch: {
        type: mongoose.Types.ObjectId,
        ref: "Pitch",
    },
    bookedDate: { type: Date },
    shift: {
        type: String,
    },
    status: {
        type: String,
        default: "Pending",
        enum: ["Pending", "Success"],
    },
    bookingBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    status: {
        type: String,
        default: "Pending",
        enum: ["Pending", "Success", "Pay By Cash"],
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    total: Number,
});

//Export the model
module.exports = mongoose.model("Booking", bookingSchema);
