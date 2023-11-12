const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var pitchCategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    brand: {
        type: Array,
        require: true
    },
    images: {
        type: Array
    },

}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('PitchCategory', pitchCategorySchema);