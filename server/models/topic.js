const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var topicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    students: {
      type: Array,
    },
    instructor: {
      type: String,
    },
    department: {
      type: String,
    },
    major: {
      type: String,
    },
    timeEnd: {
      type: Date,
    },
    timeStart: {
      type: Date,
    },
    files: {
      type: Array,
    },
    tasks: {
      type: Array,
    },
    description: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Topic", topicSchema);
