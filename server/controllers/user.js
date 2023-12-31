const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwt");
const jwt = require("jsonwebtoken");
const sendMail = require("../ultils/sendMail");
const crypto = require("crypto");
const makeToken = require("uniqid");

const createUser = asyncHandler(async (req, res) => {
  const { email, password, name, role, major, department } = req.body;
  if (!email || !password || !name || !role || !major || !department)
    return res.status(400).json({
      success: false,
      mes: "Missing inputs",
    });

  if (!role === "2") {
    req.body.schoolYear = "";
  } else {
    if (!req.body.studentId) throw new Error("Missing studentID");
  }
  const user = await User.findOne({ email });
  if (user) throw new Error("User has existed");
  else {
    const newUser = await User.create(req.body);
    return res.status(200).json({
      success: newUser ? true : false,
      mes: newUser
        ? "create is sucessfully. Please login"
        : "Something went wrong",
    });
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({
      success: false,
      mes: "Missing inputs",
    });

  //refresh token => cấp mới accesstoken .
  //access token => xác thực người dùng , phân quyền người dùng.
  const response = await User.findOne({ email });
  if (response && (await response.isCorrectPassword(password))) {
    // tách password và role ra khỏi response
    const { password, role, refreshToken, ...userData } = response.toObject();
    //tạo accesstoken
    const accessToken = generateAccessToken(response._id, role);
    //tạo refreshtoken
    const newrefreshToken = generateRefreshToken(response._id);
    // lưu refreshtoken vào database
    await User.findByIdAndUpdate(
      response._id,
      { refreshToken: newrefreshToken },
      { new: true }
    );
    // lưu refresh token vào cookie
    res.cookie("refreshToken", newrefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      accessToken,
      userData,
    });
  } else {
    throw new Error("Invalid credentials");
  }
});
const getCurrent = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id)
    .select("-refreshToken -password -role")
    .populate("major", "title -_id")
    .populate("department", "title -_id");
  return res.status(200).json({
    success: user ? true : false,
    rs: user ? user : "User not found",
  });
});
const refreshAccessToken = asyncHandler(async (req, res) => {
  // lấy token từ cookies
  const cookie = req.cookies;
  // check có token hay không
  if (!cookie && !cookie.refreshToken)
    throw new Error("No refresh token in cookie");
  // check token còn hạn hay không
  const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
  // check xem token có khớp với token đã lưu trong db
  const response = await User.findOne({
    _id: rs._id,
    refreshToken: cookie.refreshToken,
  });
  return res.status(200).json({
    success: response ? true : false,
    newAccessToken: response
      ? generateAccessToken(response._id, response.role)
      : "Refresh token not matched",
  });
});
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie || !cookie.refreshToken)
    throw new Error("No refresh token in cookies");
  // xóa refresh token ở db
  await User.findOneAndUpdate(
    { refreshToken: cookie.refreshToken },
    { refreshToken: "" },
    { new: true }
  );
  // xóa refresh token ở cookie
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.status(200).json({
    sucess: true,
    mes: "Logout is done",
  });
});
//client gửi mail
//server check mail ==> gửi mail + link (password change token)
//client check mail
//client gửi api kèm token
//check token có giống với server gửi 0
//change password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new Error("Missing email");
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  const resetToken = user.createPasswordChangedToken();
  await user.save();

  const html = `Please click to this link to reset your password. 
    <a href=${process.env.CLIENT_URL}/reset-password/${resetToken}>Click here</a>`;

  const data = {
    email,
    html,
    subject: "Forgot password",
  };
  const rs = await sendMail(data);
  return res.status(200).json({
    success: rs.response?.includes("OK") ? true : false,
    mes: rs.response?.includes("OK")
      ? "Please check your email"
      : "Somthing went wrong , try again",
  });
});
const resetPassword = asyncHandler(async (req, res) => {
  const { password, token } = req.body;
  if (!password || !token) throw new Error("Missing inputs");
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Invalid reset token");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordChangedAt = Date.now();
  user.passwordResetExpires = undefined;
  await user.save();
  return res.status(200).json({
    success: user ? true : false,
    mes: user ? "Update password" : "Something went wrong",
  });
});
const getUsers = asyncHandler(async (req, res) => {
  const response = await User.find().select("-refreshToken -password -role");
  return res.status(200).json({
    success: response ? true : false,
    users: response,
  });
});
const deleteUsers = asyncHandler(async (req, res) => {
  const { _id } = req.query;
  if (!_id) throw new Error("User not match");
  const response = await User.findByIdAndDelete(_id);
  return res.status(200).json({
    success: response ? true : false,
    deletedUser: response
      ? `User with role ${response.role} has email ${response.email} , name : ${response.name} has been deleted `
      : "No user deleted",
  });
});

const updateUsers = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!_id || Object.keys(req.body).length === 0)
    throw new Error("Missing inputs");
  const response = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  }).select("-password -role -refreshToken");
  return res.status(200).json({
    success: response ? true : false,
    updateddUsers: response ? response : "Can not update",
  });
});
const updateUsersByAdmin = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
  const response = await User.findByIdAndUpdate(uid, req.body, {
    new: true,
  }).select("-password -role -refreshToken");
  return res.status(200).json({
    success: response ? true : false,
    updatedUser: response ? response : "Can not update",
  });
});

module.exports = {
  createUser,
  login,
  getCurrent,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  getUsers,
  deleteUsers,
  updateUsers,
  updateUsersByAdmin,
  //   finalRegister,
};
