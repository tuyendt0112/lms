const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var bookingSchema = new mongoose.Schema({
    pitches: {
        pitch: { type: mongoose.Types.ObjectId, ref: 'Pitch' },
        count: Number,
        type: String
    },
    status: {
        type: String,
        default: 'Processing',
        enum: ['Cancelled', 'Processing', 'Successed']
    },
    paymentIntent: {},
    bookingBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
});

//Export the model
module.exports = mongoose.model('Booking', bookingSchema);