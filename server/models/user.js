const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcrypt");
//const crypto = require('crypto-js')
const crypto = require("crypto");
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    studentId: {
      type: String,
      unique: true,
    },
    dateOfBirth: {
      type: Date,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    schoolYear: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "2",
      enum: ["2", "3", "4"], // 2=> student, 3=>teacher , 4=>tbm ,
    },
    phoneNumber: {
      type: String,
      unique: true,
    },
    position: {
      type: String,
      required: true,
      default: "None",
    },
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
    isBlocked: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    passwordChangedAt: {
      type: String,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: String,
    },
    registerToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
});
userSchema.methods = {
  isCorrectPassword: async function (password) {
    return await bcrypt.compare(password, this.password);
  },
  createPasswordChangedToken: function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    this.passwordResetExpires = Date.now() + 15 * 60 * 1000;
    return resetToken;
  },
};

//Export the model
module.exports = mongoose.model("User", userSchema);
