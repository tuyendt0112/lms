const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        topic: {
            type: mongoose.Types.ObjectId,
            ref: "Topic",
        },
        description: {
            type: Array,
        },
        DateEnd: {
            type: Date,
            required: true,
        },
        DateStart: {
            type: Date,
            required: true,
        },
        file: {
            type: String,
            default: 'No Data'
        },
        status: {
            type: String,
            default: 'Not Submit'
        }
    }, {
    timestamps: true,
});

//Export the model
module.exports = mongoose.model('Task', taskSchema);