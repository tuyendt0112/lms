const Major = require("../models/major");
const asyncHandler = require("express-async-handler");

const createMajor = asyncHandler(async (req, res) => {
  const response = await Major.create(req.body);
  return res.status(200).json({
    success: response ? true : false,
    createdMajor: response ? response : "Can not create major",
  });
});

module.exports = {
  createMajor,
  //   finalRegister,
};
