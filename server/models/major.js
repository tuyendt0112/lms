const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var majorSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    departments: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Major", majorSchema);
