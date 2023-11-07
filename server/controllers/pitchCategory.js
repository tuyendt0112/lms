const PitchCategory = require('../models/pitchCategory')
const asyncHandler = require('express-async-handler')

const createCategory = asyncHandler(async (req, res) => {
    const response = await PitchCategory.create(req.body)
    return res.json({
        success: response ? true : false,
        createdCategory: response ? response : 'Can not creat new pitch - category'
    })

})
const getCategories = asyncHandler(async (req, res) => {
    const response = await PitchCategory.find().select('title _id')
    return res.json({
        success: response ? true : false,
        pitchCategories: response ? response : 'Can not get pitch - category'
    })

})
const updateCategory = asyncHandler(async (req, res) => {
    const { pcid } = req.params
    const response = await PitchCategory.findByIdAndUpdate(pcid, req.body, { new: true })
    return res.json({
        success: response ? true : false,
        updateCategory: response ? response : 'Can not update pitch - category'
    })

})
const deleteCategory = asyncHandler(async (req, res) => {
    const { pcid } = req.params
    const response = await PitchCategory.findByIdAndDelete(pcid)
    return res.json({
        success: response ? true : false,
        updateCategory: response ? response : 'Can not delete pitch - category'
    })

})
module.exports = {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory,
}