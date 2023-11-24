const Department = require("../models/department");
const asyncHandler = require("express-async-handler");

const createDepartment = asyncHandler(async (req, res) => {
  const response = await Department.create(req.body);
  return res.status(200).json({
    success: response ? true : false,
    createdMajor: response ? response : "Can not create Department",
  });
});

module.exports = {
    createDepartment,
  //   finalRegister,
};
