const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var pitchCategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    brands: {
        type: Array,
        // require: true
    },
    thumb: {
        type: String,
        // required: true,
        // để required thì nếu comment cho pitch chưa có thumb thì ko save đc
    },

}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('PitchCategory', pitchCategorySchema);