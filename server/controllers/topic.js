const Pitch = require("../models/pitch")
const Brand = require("../models/brand")
const asyncHandler = require("express-async-handler")

const Topic = require("../models/topic")

const createTopic = asyncHandler(async (req, res) => {
  const { title, description, department, major, DateEnd, DateStart } =
    req.body
  if (
    !title ||
    !description ||
    !department ||
    !major ||
    !DateEnd ||
    !DateStart
  )
    throw new Error("Missing inputs")
  const newTopic = await Topic.create(req.body)
  return res.status(200).json({
    success: newTopic ? true : false,
    createPitch: newTopic ? newTopic : "Can not create new topic",
  })
})

const getTopics = asyncHandler(async (req, res) => {
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
  // let queryObject = {}
  // if (queries?.q) {
  //     delete formartedQueries.q
  //     queryObject = {
  //         $or: [
  //             { title: { $regex: queries.q, $options: 'i' } },
  //             { address: { $regex: queries.q, $options: 'i' } },
  //             { category: { $regex: queries.q, $options: 'i' } },
  //             { brand: { $regex: queries.q, $options: 'i' } },
  //         ]
  //     }
  // }

  if (req.query.q) {
    delete formartedQueries.q
    formartedQueries['$or'] = [
      { title: { $regex: queries.q, $options: 'i' } },
      { department: { $regex: queries.q, $options: 'i' } },
      { major: { $regex: queries.q, $options: 'i' } },
    ]
  }
  let queryCommand = Topic.find(formartedQueries).populate({
    path: "students",
    select: "firstname lastname",
  }).populate({
    path: "instructors",
    select: "firstname lastname",
  })

  //Sorting 


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
    const counts = await Topic.find(formartedQueries).countDocuments()
    return res.status(200).json({
      success: response ? true : false,
      pitches: response ? response : 'Can not get topics',
      counts
    })
  }).catch((err) => {
    if (err) throw new Error(err, message)
  })

})
const deleteTopic = asyncHandler(async (req, res) => {
  const { pid } = req.params
  const deleteTopic = await Topic.findByIdAndDelete(pid)
  return res.status(200).json({
    success: deleteTopic ? true : false,
    mes: deleteTopic ? "Deleted" : "Can not delete pitch",
  })
})

const updateTopic = asyncHandler(async (req, res) => {
  const { pid } = req.params
  //if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
  const updateTopic = await Topic.findByIdAndUpdate(pid, req.body, {
    new: true,
  })
  return res.status(200).json({
    success: updateTopic ? true : false,
    mes: updateTopic ? "Updated" : "Can not update pitch",
  })
})
module.exports = {
  createTopic,
  getTopics,
  deleteTopic,
  updateTopic
}
