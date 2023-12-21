const Major = require("../models/major");
const Department = require("../models/department");
const asyncHandler = require("express-async-handler");

const createMajor = asyncHandler(async (req, res) => {
  const { title, department } = req.body;
  if (!title || !department) throw new Error("Missing inputs!!");

  const response = await Major.create(req.body);
  if (response) {
    // Chờ cho brand được tạo xong rồi mới thực hiện cập nhật category
    await Promise.all(
      department.map(async (departmentTitle) => {
        // Tìm category có title tương ứng
        const departmnet = await Department.findOne({
          title: departmentTitle,
        });
        if (departmnet) {
          // Cập nhật mảng brands của category
          departmnet.major.push(response.title);
          await departmnet.save();
        }
      })
    );
  }
  return res.status(200).json({
    success: response ? true : false,
    createdMajor: response ? response : "Cannot create new brand",
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
  const response = await Major.findByIdAndDelete(mid);
  return res.json({
    success: response ? true : false,
    message: response ? "Deleted" : "Can not delete major",
  });
});
const updateMajor = asyncHandler(async (req, res) => {
  const { mid, title } = req.body;
  console.log(req.body);
  console.log("mid", mid);
  const response = await Major.findByIdAndUpdate(
    mid,
    { title: title },
    {
      new: true,
    }
  );
  return res.json({
    success: response ? true : false,
    message: response ? "Updated" : "Fail !!!",
  });
});
module.exports = {
  createMajor,
  getAllMajor,
  deleteMajor,
  updateMajor,
};
