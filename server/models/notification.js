const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema(
  {
    //   creator_external: { type: mongoose.Schema.Types.ObjectId, ref: "External" }, // can be external or student
    creator_user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    //   receiver_external: { type: mongoose.Schema.Types.ObjectId, ref: "External" },
    receiver_user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
