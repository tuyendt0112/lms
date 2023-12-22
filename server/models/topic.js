const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var topicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    instructors: { type: mongoose.Types.ObjectId, ref: "User" },
    students: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    // instructor: {
    //   type: Array,
    // },
    major: {
      type: String,
    },
    department: {
      type: String,
    },
    DateEnd: {
      type: Date,
    },
    DateStart: {
      type: Date,
    },
    description: {
      type: Array,
    },
    status: {
      type: String,
      enum: ["Pending", "Validated"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Topic", topicSchema);
