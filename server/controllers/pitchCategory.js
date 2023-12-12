const PitchCategory = require('../models/pitchCategory')
const asyncHandler = require('express-async-handler')

const createCategory = asyncHandler(async (req, res) => {
    const { title } = req.body
    const thumb = req?.files?.thumb[0]?.path
    if (!title) throw new Error('Missing inputs')
    if (thumb) req.body.thumb = thumb
    const response = await PitchCategory.create(req.body)
    return res.json({
        success: response ? true : false,
        mes: response ? "Create Category Success" : 'Fail!!!'
    })

})
// const getCategories = asyncHandler(async (req, res) => {
//     const response = await PitchCategory.find()
//     const exlcludeFields = ['limit', 'sort', 'page', 'fields']

//     return res.json({
//         success: response ? true : false,
//         pitchCategories: response ? response : 'Can not get pitch - category',
//     })

// })

//filtering , sorting & pagination

const getCategories = asyncHandler(async (req, res) => {
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

    let queryCommand = PitchCategory.find(formartedQueries)

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
        const counts = await PitchCategory.find(formartedQueries).countDocuments()
        return res.status(200).json({
            success: response ? true : false,
            pitchCategories: response ? response : 'Can not get pitchs',
            counts
        })
    }).catch((err) => {
        if (err) throw new Error(err, message)
    })

})
const updateCategory = asyncHandler(async (req, res) => {
    const { pcid } = req.params
    const response = await PitchCategory.findByIdAndUpdate(pcid, req.body, { new: true })
    return res.json({
        success: response ? true : false,
        mes: response ? 'Update Category Success' : 'Fail !!!'
    })

})
const deleteCategory = asyncHandler(async (req, res) => {
    const { pcid } = req.params
    const response = await PitchCategory.findByIdAndDelete(pcid)
    return res.json({
        success: response ? true : false,
        mes: response ? 'Deleted' : 'Can not delete pitch - category'
    })

})

const uploadImagesCategories = asyncHandler(async (req, res) => {
    const { pcid } = req.params
    if (!req.files) throw new Error('Missing inputs')
    const response = await PitchCategory.findByIdAndUpdate(pcid, { $push: { images: { $each: req.files.map(el => el.path) } } })
    return res.status(200).json({
        status: response ? true : false,
        updatedCategory: response ? response : 'Cannot upload images pitches'
    })
})

const getAllCategories = asyncHandler(async (req, res) => {
    const response = await PitchCategory.find();
    return res.json({
        success: response ? true : false,
        PitchCategoriess: response ? response : "Can not get data",
    });
});
module.exports = {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory,
    uploadImagesCategories,
    getAllCategories
}