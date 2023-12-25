const Pitch = require("../models/pitch")
const Brand = require("../models/brand")
const asyncHandler = require("express-async-handler")

const Task = require("../models/task")

const createTask = asyncHandler(async (req, res) => {
    const { title, description, DateEnd, DateStart } = req.body
    if (
        !title ||
        !description ||
        !DateEnd ||
        !DateStart
    )
        throw new Error("Missing inputs123")
    const newTask = await Task.create(req.body)
    return res.status(200).json({
        success: newTask ? true : false,
        createTask: newTask ? newTask : "Can not create new task",
    })
})

const getTasks = asyncHandler(async (req, res) => {
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
    let queryCommand = Task.find(formartedQueries)
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
        const counts = await Task.find(formartedQueries).countDocuments()
        return res.status(200).json({
            success: response ? true : false,
            tasks: response ? response : 'Can not get tasks',
            counts
        })
    }).catch((err) => {
        if (err) throw new Error(err, message)
    })

})
const deleteTask = asyncHandler(async (req, res) => {
    const { tid } = req.params
    const deleteTask = await Task.findByIdAndDelete(tid)
    return res.status(200).json({
        success: deleteTask ? true : false,
        mes: deleteTask ? "Deleted" : "Can not delete pitch",
    })
})

const updateTask = asyncHandler(async (req, res) => {
    const { _id } = req.body
    const file = req.files["file"][0];
    console.log(file)
    if (file?.path) req.body.file = file?.path;
    console.log(req.body)
    //if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const updateTask = await Task.findByIdAndUpdate(_id, { file: file?.path, status: 'Submit' }, {
        new: true,
    })
    return res.status(200).json({
        success: updateTask ? true : false,
        mes: updateTask ? "Updated Task Success" : "Can not update pitch",
    })
})


// const createNotification = asyncHandler(async (req, res) => {
//     const { title, content } = req.body;
//     const file = req.files["file"][0];
//     console.log(file);
//     if (!title || !content) throw new Error("Missing inputs!!");
//     //   const modifiedFilePath = file.path.slice(0, -3) + "jpg";
//     if (file?.path) req.body.file = file?.path;
//     const response = await Notification.create(req.body);
//     return res.status(200).json({
//         success: response ? true : false,
//         mes: response
//             ? "Create notification success"
//             : "Cannot create new Notification",
//     });
// });
module.exports = {
    createTask,
    getTasks,
    deleteTask,
    updateTask
}