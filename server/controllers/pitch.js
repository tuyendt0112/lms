const Pitch = require('../models/pitch')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')

const createPitch = asyncHandler(async (req, res) => {
    const { title, description, address, brand, price, category, owner } = req.body
    const thumb = req?.files?.thumb[0]?.path
    const images = req.files?.images?.map(el => el.path)
    if (!title || !description || !address || !price || !category || !owner || !brand) throw new Error('Missing inputs')
    req.body.slug = slugify(title)
    if (thumb) req.body.thumb = thumb
    if (images) req.body.images = images
    const newPitch = await Pitch.create(req.body)
    return res.status(200).json({
        success: newPitch ? true : false,
        createPitch: newPitch ? newPitch : 'Can not create new pitch'
    })
})
const getPitch = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const pitch = await Pitch.findById(pid).populate({
        path: 'ratings',
        populate: {
            path: 'postedBy',
            select: 'firstname lastname avatar'
        }
    })
    return res.status(200).json({
        success: pitch ? true : false,
        pitchData: pitch ? pitch : 'Can not get pitch'
    })
})

//filtering , sorting & pagination

const getPitchs = asyncHandler(async (req, res) => {
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
            { address: { $regex: queries.q, $options: 'i' } },
            { category: { $regex: queries.q, $options: 'i' } },
            { brand: { $regex: queries.q, $options: 'i' } },
        ]
    }

    let queryCommand = Pitch.find(formartedQueries).populate({
        path: 'owner',
        select: 'firstname lastname'
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
        const counts = await Pitch.find(formartedQueries).countDocuments()
        return res.status(200).json({
            success: response ? true : false,
            pitches: response ? response : 'Can not get pitchs',
            counts
        })
    }).catch((err) => {
        if (err) throw new Error(err, message)
    })

})

const getPitches = asyncHandler(async (req, res) => {
    const queries = { ...req.query };

    // seperate special field
    const excludeFields = ["limit", "sort", "page", "fields"];
    excludeFields.forEach(el => delete queries[el]);
    // Format operators
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(
        /\b(gte|gt|lt|lte)\b/g,
        matchedEl => `$${matchedEl}`
    );

    const formatedQueries = JSON.parse(queryString);
    // console.log(formatedQueries);
    let addressQueryObject = {};
    // filtering
    if (queries?.title)
        formatedQueries.title = { $regex: queries.title, $options: "i" };
    if (queries?.brand)
        formatedQueries.brand = { $regex: queries.brand, $options: "i" };
    if (queries?.category) {
        formatedQueries.category = { $regex: queries.category, $options: "i" };
    }

    if (queries?.address) {
        delete formatedQueries.address;
        const addressArray = queries.address?.split(",");
        const addressQuery = addressArray.map((el) => ({
            address: {
                $regex: el,
                $options: "i",
            },
        }));
        if (req.query.q) {
            if (addressQuery.length >= 2) {
                addressQueryObject = { $or: addressQuery };
            }
            else {
                addressQueryObject = { $and: addressQuery };
            }
        }
        else {
            addressQueryObject = { $or: addressQuery };
        }
    }
    // console.log(queries.q)
    // { address: { $regex: queries.q, $options: "i" } },
    if (req.query.q) {
        delete formatedQueries.q;
        if (queries?.address) {
            formatedQueries["$or"] = [
                { title: { $regex: queries.q, $options: "i" } },
                { address: addressQueryObject["$or"]?.[0].address },
                { category: { $regex: queries.q, $options: "i" } },
                { brand: { $regex: queries.q, $options: "i" } },
            ];
        }
        else {
            formatedQueries["$or"] = [
                { title: { $regex: queries.q, $options: "i" } },
                { address: { $regex: queries.q, $options: "i" } },
                { category: { $regex: queries.q, $options: "i" } },
                { brand: { $regex: queries.q, $options: "i" } },
            ];
        }
    }
    const qr = ({ ...addressQueryObject, ...formatedQueries });

    let queryCommand = Pitch.find(qr);

    // softing
    if (req.query.sort) {
        const softBy = req.query.sort.split(",").join(" ");
        queryCommand = queryCommand.sort(softBy);
    }
    // fields limiting
    if (req.query.fields) {
        const fields = req.query.fields.split(",").join(" ");
        queryCommand = queryCommand.select(fields);
    }
    // pagination
    // limit
    //skip: 1 2 3 ....10 => skip = 2
    const page = +req.query.page || 1;
    const limit = +req.query.limit || process.env.LIMIT_PITCH;
    const skip = (page - 1) * limit;
    queryCommand.skip(skip).limit(limit);
    // Execute query
    //  Số lượng sản phẩm thỏa mãn điều kiện !== số lượng sp trả về 1 lần gọi API
    queryCommand.exec(async (err, response) => {
        if (err) throw new Error(err.message);

        const counts = await Pitch.find(qr).countDocuments();
        return res.status(200).json({
            success: response ? true : false,
            pitches: response ? response : "Cannot get pitch",
            totalCount: counts,
        });
    })
})

const updatePitch = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const files = req?.files
    if (files?.thumb) {
        req.body.thumb = files?.thumb[0].path
    }
    if (files?.images) {
        req.body.thumb = files?.images?.map(el => el.path)
    }
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const updatePitch = await Pitch.findByIdAndUpdate(pid, req.body, { new: true })
    return res.status(200).json({
        success: updatePitch ? true : false,
        mes: updatePitch ? "Updated" : 'Can not update pitch'
    })
})
const deletePitch = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const deletePitch = await Pitch.findByIdAndDelete(pid)
    return res.status(200).json({
        success: deletePitch ? true : false,
        mes: deletePitch ? "Deleted" : 'Can not delete pitch'
    })
})
const ratings = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { star, comment, pid, updatedAt } = req.body
    if (!star || !pid) throw new Error('Missing inputs')
    const ratingPitch = await Pitch.findById(pid)
    const alreadyRating = ratingPitch?.ratings?.find(el => el.postedBy.toString() === _id)

    if (alreadyRating) {
        //update star and comment again
        await Pitch.updateOne({
            ratings: { $elemMatch: alreadyRating }
        }, {
            $set: { "ratings.$.star": star, "ratings.$.comment": comment, "ratings.$.updatedAt": updatedAt }
        }, { new: true })
    } else {
        //add star and comment first time
        const response = await Pitch.findByIdAndUpdate(pid, {
            $push: { ratings: { star, comment, postedBy: _id, updatedAt } }
        }, { new: true })
    }

    //sumratings
    const updatedPitch = await Pitch.findById(pid)
    const ratingCount = updatedPitch.ratings.length
    const sumRatings = updatedPitch.ratings.reduce((sum, el) => sum + el.star, 0)
    updatedPitch.totalRatings = Math.round(sumRatings * 10 / ratingCount) / 10
    await updatedPitch.save()
    return res.status(200).json({
        status: true,
        updatedPitch
    })
})

const uploadImagesPitch = asyncHandler(async (req, res) => {
    const { pid } = req.params
    if (!req.files) throw new Error('Missing inputs')
    const response = await Pitch.findByIdAndUpdate(pid, { $push: { images: { $each: req.files.map(el => el.path) } } })
    return res.status(200).json({
        status: response ? true : false,
        updatedPitch: response ? response : 'Cannot upload images pitches'
    })
})



module.exports = {
    createPitch,
    getPitch,
    getPitchs,
    updatePitch,
    deletePitch,
    ratings,
    uploadImagesPitch,
    getPitches
}