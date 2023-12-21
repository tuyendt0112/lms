const Major = require("../models/major");
const Department = require("../models/department");
const asyncHandler = require("express-async-handler");

const createDepartment = asyncHandler(async (req, res) => {
  const response = await Department.create(req.body);
  return res.status(200).json({
    success: response ? true : false,
    message: response
      ? "Create department success"
      : "Can not create Department",
  });
});

const getDepartments = asyncHandler(async (req, res) => {
  const queries = { ...req.query };
  // tách các trường đặc biệt ra khỏi query
  const exlcludeFields = ["limit", "sort", "page", "fields"];
  exlcludeFields.forEach((el) => delete queries[el]);
  //Format lại các operators cho đúng cú pháp mongoose
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (matchedEl) => `$${matchedEl}`
  );
  const formartedQueries = JSON.parse(queryString);

  // Filtering
  if (queries?.title)
    formartedQueries.title = { $regex: queries.title, $options: "i" };

  if (req.query.q) {
    delete formartedQueries.q;
    formartedQueries["$or"] = [{ title: { $regex: queries.q, $options: "i" } }];
  }
  //Sorting

  let queryCommand = Department.find(formartedQueries);

  //Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    queryCommand = queryCommand.sort(sortBy);
  }

  // Fields limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    queryCommand = queryCommand.select(fields);
  }

  //Pagination
  //limit : số object lấy về 1 lần gọi API
  //skip 2 (bỏ qua 2 cái đầu)
  // +2 => 2
  const page = +req.query.page || 1;
  const limit = +req.query.limit || process.env.LIMIT_PITCHS;
  const skip = (page - 1) * limit;
  queryCommand.skip(skip).limit(limit);

  // Executed query
  // Số lượng sân thỏa điều kiện
  queryCommand
    .then(async (response) => {
      const counts = await Department.find(formartedQueries).countDocuments();
      return res.status(200).json({
        success: response ? true : false,
        Departments: response ? response : "Can not get departments",
        totalCount: counts,
      });
    })
    .catch((err) => {
      if (err) throw new Error(err, message);
    });
});

const deleteDepartment = asyncHandler(async (req, res) => {
  const { did } = req.params;

  // find old title
  const deletedDepartment = await Department.findById(did);
  // delete topic
  // const deletedTopic = await Topic.findOne({ major: deletedMajor.title });
  // if (deletedTopic) {
  //   await Topic.deleteMany({ major: deletedMajor.title });
  // }
  const deletedTitle = deletedDepartment.title;
  // update department
  const majors = deletedDepartment.majors;
  await Promise.all(
    majors.map(async (majorTitle) => {
      // Tìm category có title tương ứng
      const updatedMajor = await Major.findOneAndUpdate(
        { departments: { $in: [deletedTitle] } },
        { $pull: { departments: deletedTitle } },
        { new: true }
      );
    })
  );

  const response = await Department.findByIdAndDelete(did);
  return res.status(200).json({
    success: response ? true : false,
    message: response ? "Deleted" : "Cannot delete department",
  });
});

const updateDepartment = asyncHandler(async (req, res) => {
  const { did, title } = req.body;
  const newTitle = title;
  const oldDepartment = await Department.findById(did);
  const oldTitle = oldDepartment.title;
  // const oldDepartments = oldMajor.departments;

  // if (req.body.departments === "null") {
  //   req.body.departments = oldDepartments;
  // } else if (typeof req.body.departments === "string") {
  //   const Cate = req.body.departments;
  //   let DepartmentArray = [];
  //   DepartmentArray = Cate.split(",");
  //   req.body.departments = DepartmentArray;
  // }

  // if (req.body && req.body?.title) {
  //   // update slug
  //   const updatedTopic = await Topic.findOne({ major: oldTitle });
  //   if (updatedTopic) {
  //     await Topic.updateMany(
  //       { major: oldTitle }, // Điều kiện để chỉnh sửa
  //       { $set: { major: req.body?.title } } // Giá trị mới
  //     );
  //   }
  // }

  const updatedDepartment = await Department.findByIdAndUpdate(
    did,
    { title: newTitle },
    {
      new: true,
    }
  );

  const majorsList = updatedDepartment?.majors;
  await Promise.all(
    majorsList?.map(async (majorTitle) => {
      const updatedMajor = await Major.findOneAndUpdate(
        { departments: { $all: [oldTitle] } },
        { $set: { "departments.$": updatedDepartment.title } },
        { new: true }
      );
    })
  );
  return res.status(200).json({
    success: updatedDepartment ? true : false,
    message: updatedDepartment ? "Updated" : "Cannot update department",
  });
});

module.exports = {
  createDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment,
};
