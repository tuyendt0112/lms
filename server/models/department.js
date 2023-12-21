const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var departmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    majors: {
      type: Array,
      
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Department", departmentSchema);
