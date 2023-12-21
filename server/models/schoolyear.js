const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var schoolyearSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    start: {
        type: String,
        required: true,
    },
    end: {
        type: String,
        required: true,
    },

});

//Export the model
module.exports = mongoose.model('schoolyear', schoolyearSchema);