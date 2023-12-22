const SchoolYear = require('../models/schoolyear')
const asyncHandler = require('express-async-handler')

const createSchoolYear = asyncHandler(async (req, res) => {
    const { title, start, end } = req.body
    if (!title || !start || !end) throw new Error('Missing inputs')
    const newSchoolYear = await SchoolYear.create(req.body)
    return res.status(200).json({
        success: newSchoolYear ? true : false,
        mes: newSchoolYear ? 'Create school year success' : 'Can not create new schoolyear'
    })
})

const getSchoolYears = asyncHandler(async (req, res) => {
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

    let queryCommand = SchoolYear.find(formartedQueries);

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
            const counts = await SchoolYear.find(formartedQueries).countDocuments();
            return res.status(200).json({
                success: response ? true : false,
                SchoolYears: response ? response : "Can not get school year",
                totalCount: counts,
            });
        })
        .catch((err) => {
            if (err) throw new Error(err, message);
        });
})

const updateSchoolYear = asyncHandler(async (req, res) => {
    const { sid } = req.params
    const updateSchoolYear = await SchoolYear.findByIdAndUpdate(sid, req.body, { new: true })
    return res.status(200).json({
        success: updateSchoolYear ? true : false,
        mes: updateSchoolYear ? "Updated school year success" : 'Can not update school year'
    })
})

const deleteSchoolYear = asyncHandler(async (req, res) => {
    const { sid } = req.params
    const deleteSchoolYear = await SchoolYear.findByIdAndDelete(sid)
    return res.status(200).json({
        success: deleteSchoolYear ? true : false,
        mes: deleteSchoolYear ? "Deleted school year success" : 'Can not delete school year'
    })
})

module.exports = {
    createSchoolYear,
    getSchoolYears,
    updateSchoolYear,
    deleteSchoolYear
}