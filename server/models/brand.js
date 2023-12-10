const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var brandSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        slug: {
            type: String,
            required: true,
            lowercase: true,
        },
        categories: {
            type: Array,
        },
        description: {
            type: Array,
        },
        thumb: {
            type: String,
            // required: true,
            // để required thì nếu comment cho pitch chưa có thumb thì ko save đc
        },
        images: {
            type: Array,
        },
        address: {
            type: String,
        },
        owner: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            default: "654aeed30df025516275eef0",
        },
        ratings: [
            {
                star: { type: Number },
                postedBy: { type: mongoose.Types.ObjectId, ref: "User" },
                comment: { type: String },
                updatedAt: { type: Date },
            },
        ],
        totalRatings: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Brand", brandSchema);