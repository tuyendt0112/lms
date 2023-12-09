const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var pitchSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    description: {
        type: Array,
        required: true,
    },
    address: {
        type: Array,
        required: true,
    },
    brand: {
        type: String,
        // required: true,
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    thumb: {
        type: String,
        // required: true,
        // để required thì nếu comment cho pitch chưa có thumb thì ko save đc
    },
    images: {
        type: Array
    },
    ratings: [
        {
            star: { type: Number },
            postedBy: { type: mongoose.Types.ObjectId, ref: 'User' },
            comment: { type: String },
            updatedAt: { type: Date }
        }
    ],
    totalRatings: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["Empty", "Booked", "Maintain"],
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Pitch', pitchSchema);