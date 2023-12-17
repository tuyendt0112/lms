const Department = require("../models/department");
const asyncHandler = require("express-async-handler");

const createDepartment = asyncHandler(async (req, res) => {
  const response = await Department.create(req.body);
  return res.status(200).json({
    success: response ? true : false,
    mes: response ? "Create department success" : "Can not create Department",
  });
});

const getDepartment = asyncHandler(async (req, res) => {
  const queries = { ...req.query }
  // tách các trường đặc biệt ra khỏi query
  const exlcludeFields = ['limit', 'sort', 'page', 'fields']
  exlcludeFields.forEach(el => delete queries[el])
  //Format lại các operators cho đúng cú pháp mongoose
  let queryString = JSON.stringify(queries)
  queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchedEl => `$${matchedEl}`)
  const formartedQueries = JSON.parse(queryString)

  // Filtering
  if (queries?.title) formartedQueries.title = { $regex: queries.title, $options: 'i' }

  if (req.query.q) {
    delete formartedQueries.q
    formartedQueries['$or'] = [
      { title: { $regex: queries.q, $options: 'i' } },
    ]
  }
  //Sorting 

  let queryCommand = Department.find(formartedQueries)

  //Sorting 
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
    queryCommand = queryCommand.sort(sortBy)
  }

  // Fields limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ')
    queryCommand = queryCommand.select(fields)
  }

  //Pagination
  //limit : số object lấy về 1 lần gọi API
  //skip 2 (bỏ qua 2 cái đầu)
  // +2 => 2 
  const page = +req.query.page || 1
  const limit = +req.query.limit || process.env.LIMIT_PITCHS
  const skip = (page - 1) * limit
  queryCommand.skip(skip).limit(limit)

  // Executed query
  // Số lượng sân thỏa điều kiện 
  queryCommand.then(async (response) => {
    const counts = await Department.find(formartedQueries).countDocuments()
    return res.status(200).json({
      success: response ? true : false,
      department: response ? response : 'Can not get departments',
      counts
    })
  }).catch((err) => {
    if (err) throw new Error(err, message)
  })

})
module.exports = {
  createDepartment,
  getDepartment
  //   finalRegister,
};
