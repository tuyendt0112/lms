const Major = require("../models/major");
const Topic = require("../models//topic");
const Department = require("../models/department");
const asyncHandler = require("express-async-handler");

const createMajor = asyncHandler(async (req, res) => {
  const { title, departments } = req.body;
  if (!title || !departments) throw new Error("Missing inputs!!");

  const response = await Major.create(req.body);
  if (response) {
    // Chờ cho major được tạo xong rồi mới thực hiện cập nhật department
    await Promise.all(
      departments.map(async (departmentTitle) => {
        // Tìm department có title tương ứng trong data
        const departmentRs = await Department.findOne({
          title: departmentTitle,
        });
        if (departmentRs) {
          // Cập nhật mảng majors của department
          departmentRs.majors.push(response.title);
          await departmentRs.save();
        }
      })
    );
  }
  return res.status(200).json({
    success: response ? true : false,
    createdMajor: response ? response : "Cannot create new Major",
  });
});
const getAllMajor = asyncHandler(async (req, res) => {
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
  // regex: tìm từ bắt đầu bằng chữ truyền vào
  // options: 'i' không phân biệt viết hoa viết thường
  // doc: https://www.mongodb.com/docs/manual/reference/operator/query/regex/
  if (queries?.title)
    formartedQueries.title = { $regex: queries.title, $options: "i" };

  if (req.query.q) {
    delete formartedQueries.q;
    formartedQueries["$or"] = [{ title: { $regex: queries.q, $options: "i" } }];
  }
  let queryCommand = Major.find(formartedQueries);

  //Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    queryCommand = queryCommand.sort(sortBy);
  }

  // Fields litmiting
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    queryCommand = queryCommand.select(fields);
  }

  //Pagination
  //limit : số object lấy về 1 lần gọi API
  //skip 2 (bỏ qua 2 cái đầu)
  // +2 => 2
  const page = +req.query.page || 1;
  const limit = +req.query.limit || process.env.LIMIT_USERS;
  const skip = (page - 1) * limit;
  queryCommand.skip(skip).limit(limit);

  // Executed query
  // Số lượng sân thỏa điều kiện
  queryCommand.exec(async (err, response) => {
    if (err) throw new Error(err.message);

    const counts = await Major.find(formartedQueries).countDocuments();
    return res.status(200).json({
      success: response ? true : false,
      Majors: response ? response : "Cannot get brands",
      totalCount: counts,
    });
  });
});
const deleteMajor = asyncHandler(async (req, res) => {
  const { mid } = req.params;

  // find old title
  const deletedMajor = await Major.findById(mid);
  // delete topic
  const deletedTopic = await Topic.findOne({ major: deletedMajor.title });
  if (deletedTopic) {
    await Topic.deleteMany({ major: deletedMajor.title });
  }
  const deletedTitle = deletedMajor.title;
  // update department
  const departments = deletedMajor.departments;
  await Promise.all(
    departments.map(async (categoryTitle) => {
      // Tìm category có title tương ứng
      const updatedDepartment = await Department.findOneAndUpdate(
        { majors: { $in: [deletedTitle] } },
        { $pull: { majors: deletedTitle } },
        { new: true }
      );
    })
  );

  const response = await Major.findByIdAndDelete(mid);
  return res.status(200).json({
    success: response ? true : false,
    message: response ? "Deleted" : "Cannot delete major",
  });
});
const updateMajor = asyncHandler(async (req, res) => {
  const { mid, title } = req.body;
  const newTitle = title;
  const oldMajor = await Major.findById(mid);
  const oldTitle = oldMajor.title;
  // const oldDepartments = oldMajor.departments;

  // if (req.body.departments === "null") {
  //   req.body.departments = oldDepartments;
  // } else if (typeof req.body.departments === "string") {
  //   const Cate = req.body.departments;
  //   let DepartmentArray = [];
  //   DepartmentArray = Cate.split(",");
  //   req.body.departments = DepartmentArray;
  // }

  if (req.body && req.body?.title) {
    // update slug
    const updatedTopic = await Topic.findOne({ major: oldTitle });
    if (updatedTopic) {
      await Topic.updateMany(
        { major: oldTitle }, // Điều kiện để chỉnh sửa
        { $set: { major: req.body?.title } } // Giá trị mới
      );
    }
  }

  const updatedMajor = await Major.findByIdAndUpdate(
    mid,
    { title: newTitle },
    {
      new: true,
    }
  );

  const departmentsList = updatedMajor?.departments;
  await Promise.all(
    departmentsList?.map(async (departmentTitle) => {
      const updatedDepartment = await Department.findOneAndUpdate(
        { majors: { $all: [oldTitle] } },
        { $set: { "majors.$": updatedMajor.title } },
        { new: true }
      );
    })
  );
  return res.status(200).json({
    success: updatedMajor ? true : false,
    message: updatedMajor ? "Updated" : "Cannot update major",
  });
});

module.exports = {
  createMajor,
  getAllMajor,
  deleteMajor,
  updateMajor,
};
