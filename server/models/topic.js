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
    topicId: {
      type: String,
    },
    instructors: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    students: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    // instructor: {
    //   type: Array,
    // },
    major: {
      type: mongoose.Types.ObjectId,
      ref: "Major",
      require: true,
    },
    department: {
      type: mongoose.Types.ObjectId,
      ref: "Department",
      require: true,
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
    status: {
      type: String,
      enum: ["Wait", "Cancel", "Approve", "Pending"], //Pending:chờ phản biện , Wait : chờ chấp thuận , Cancel: hủy,  Approve : chấp thuận, Success: done
      default: "Wait",
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Topic", topicSchema);
