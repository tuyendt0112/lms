const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var notificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: Array,
        required: true,
    },
    file: {
        type: String,
    },

});

//Export the model
module.exports = mongoose.model('Notification', notificationSchema);