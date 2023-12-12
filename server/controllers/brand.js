const Brand = require("../models/brand");
const PitchCategory = require("../models/pitchCategory");
const asyncHandler = require("express-async-handler");
const { createSlug } = require("../ultils/helpers");

const createBrand = asyncHandler(async (req, res) => {
    const { title, description, address, categories, owner } = req.body;
    const thumb = req?.files?.thumb[0]?.path;
    const images = req.files?.images?.map((el) => el.path);
    if (!title || !description || !address || !categories)
        throw new Error("Missing inputs!!");
    const slug = createSlug(title);
    req.body.slug = slug;
    if (thumb) req.body.thumb = thumb;
    if (images) req.body.images = images;
    //
    let categoryArray = [];
    categoryArray = req.body.categories.split(",");
    req.body.categories = categoryArray;
    const response = await Brand.create(req.body);
    if (response) {
        // Chờ cho brand được tạo xong rồi mới thực hiện cập nhật category
        await Promise.all(
            categoryArray.map(async (categoryTitle) => {
                // Tìm category có title tương ứng
                const pitchCategory = await PitchCategory.findOne({
                    title: categoryTitle,
                });
                if (pitchCategory) {
                    // Cập nhật mảng brands của category
                    pitchCategory.brands.push(response.title);
                    await pitchCategory.save();
                }
            })
        );
    }
    return res.status(200).json({
        success: response ? true : false,
        createdBrand: response ? response : "Cannot create new brand",
    });
});
const getCateByBrand = asyncHandler(async (req, res) => { });

const getBrands = asyncHandler(async (req, res) => {
    const { brandId } = req.params;
    const excludeFields = [
        "title",
        "address",
        "category",
        "description",
        "images",
    ];
    const response = await Brand.findById(brandId).populate(
        "owner",
        excludeFields
    );
    return res.status(200).json({
        success: response ? true : false,
        BrandData: response ? response : "Cannot get brand",
    });
});
const updateBrand = asyncHandler(async (req, res) => {
    const { bid } = req.body;
    const files = req?.files;
    // find old title

    if (files?.thumb) {
        req.body.thumb = files?.thumb[0].path;
    }
    if (files?.images) {
        req.body.thumb = files?.images?.map((el) => el.path);
    }
    const oldBrand = await Brand.findById(bid);
    const oldTitle = oldBrand.title;
    const oldCategories = oldBrand.categories;
    // if (req.body && req.body.title) req.body.slug = slugify(req.body.title);'
    if (req.body.categories === "null") {
        req.body.categories = oldCategories;
    } else if (typeof req.body.categories === "string") {
        const Cate = req.body.categories;
        let categoryArray = [];
        categoryArray = Cate.split(",");
        req.body.categories = categoryArray;
    }

    if (req.body && req.body?.title) req.body.slug = createSlug(req.body.title); // update slug
    const updatedBrand = await Brand.findByIdAndUpdate(bid, req.body, {
        new: true,
    });
    // update pitchCategory
    const categories = updatedBrand?.categories;
    await Promise.all(
        categories?.map(async (categoryTitle) => {
            // Tìm category có title tương ứng
            const updatedCategory = await PitchCategory.findOneAndUpdate(
                { brands: { $all: [oldTitle] } },
                { $set: { "brands.$": updatedBrand.title } },
                { new: true }
            );
        })
    );

    return res.status(200).json({
        success: updatedBrand ? true : false,
        message: updatedBrand ? "Updated" : "Cannot update brand",
    });
});
const deleteBrand = asyncHandler(async (req, res) => {
    const { bid } = req.params;

    // find old title
    const deletedBrand = await Brand.findById(bid);
    const deletedTitle = deletedBrand.title;
    // update pitchCategory
    const categories = deletedBrand.categories;
    await Promise.all(
        categories.map(async (categoryTitle) => {
            // Tìm category có title tương ứng
            const updatedCategory = await PitchCategory.findOneAndUpdate(
                { brands: { $in: [deletedTitle] } },
                { $pull: { brands: deletedTitle } },
                { new: true }
            );
        })
    );

    const response = await Brand.findByIdAndDelete(bid);
    return res.status(200).json({
        success: response ? true : false,
        message: response ? "Deleted" : "Cannot delete brand",
    });
});

// const ratings = asyncHandler(async (req, res) => {
//   const { _id } = req.user;
//   const { star, comment, bid, updatedAt } = req.body;
//   if (!star || !bid) throw new Error("Missing input");
//   const ratingBrand = await Brand.findById(bid);
//   const alreadyRating = ratingBrand?.ratings?.find(
//     (el) => el.postedBy.toString() === _id
//   );
//   if (alreadyRating) {
//     // update rating
//     await Brand.updateOne(
//       {
//         ratings: { $elemMatch: alreadyRating },
//       },
//       {
//         $set: {
//           "ratings.$.star": star,
//           "ratings.$.comment": comment,
//           "ratings.$.updatedAt": updatedAt,
//         },
//       },
//       { new: true }
//     );
//   } else {
//     // add star and comment
//     await Brand.findByIdAndUpdate(
//       bid,
//       {
//         $push: { ratings: { star, comment, postedBy: _id } },
//       },
//       { new: true }
//     );
//   }
//   // sum ratings
//   const updateBrand = await Pitch.findById(brandId);

//   const ratingCount = updateBrand.ratings.length;

//   const sumRatings = updateBrand.ratings.reduce((sum, el) => sum + +el.star, 0);

//   updatedBrand.totalRatings = Math.round((sumRatings * 10) / ratingCount) / 10;
//   await updateBrand.save();

//   return res.status(200).json({
//     status: true,
//     updateBrand,
//   });
// });
const ratings = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, comment, bid, updatedAt } = req.body;
    if (!star || !bid) throw new Error("Missing inputs");
    const ratingBrand = await Brand.findById(bid);
    const alreadyRating = ratingBrand?.ratings?.find(
        (el) => el.postedBy.toString() === _id
    );

    if (alreadyRating) {
        //update star and comment again
        await Brand.updateOne(
            {
                ratings: { $elemMatch: alreadyRating },
            },
            {
                $set: {
                    "ratings.$.star": star,
                    "ratings.$.comment": comment,
                    "ratings.$.updatedAt": updatedAt,
                },
            },
            { new: true }
        );
    } else {
        //add star and comment first time
        const response = await Brand.findByIdAndUpdate(
            bid,
            {
                $push: { ratings: { star, comment, postedBy: _id, updatedAt } },
            },
            { new: true }
        );
    }
    const getBrand = asyncHandler(async (req, res) => {
        const { bid } = req.params;
        const pitch = await Brand.findById(bid).populate({
            path: "ratings",
            populate: {
                path: "postedBy",
                select: "firstname lastname avatar",
            },
        });
        return res.status(200).json({
            success: pitch ? true : false,
            pitchData: pitch ? pitch : "Can not get pitch",
        });
    });
    //sumratings
    const updatedBrand = await Brand.findById(bid);
    const ratingCount = updatedBrand.ratings.length;
    const sumRatings = updatedBrand.ratings.reduce((sum, el) => sum + el.star, 0);
    updatedBrand.totalRatings = Math.round((sumRatings * 10) / ratingCount) / 10;
    await updatedBrand.save();
    return res.status(200).json({
        status: true,
        updatedBrand,
    });
});

const updateBrandDescription = asyncHandler(async (req, res) => {
    const { pitchId } = req.params;
    if (!req.body.description) throw new Error("Missing Inputs");
    const response = await Pitch.findByIdAndUpdate(
        pitchId,
        { $push: { description: req.body.description } },
        { new: true }
    );
    return res.status(200).json({
        success: response ? true : false,
        message: response ? response : "Cannot update description pitch",
    });
});
const updateBrandAddress = asyncHandler(async (req, res) => {
    const { pitchId } = req.params;
    if (!req.body.address) throw new Error("Missing Inputs");
    const response = await Pitch.findByIdAndUpdate(
        pitchId,
        { $push: { address: req.body.address } },
        { new: true }
    );
    return res.status(200).json({
        success: response ? true : false,
        message: response ? response : "Cannot update address pitch",
    });
});
const uploadImagesBrand = asyncHandler(async (req, res) => {
    const { brandId } = req.params;
    if (!req.files) throw new Error("Missing Inputs");

    const response = await Brand.findByIdAndUpdate(
        brandId,
        {
            $push: { images: { $each: req.files.map((el) => el.path) } },
        },
        { new: true }
    );
    return res.status(200).json({
        success: response ? true : false,
        message: response ? response : "Cannot upload images brand",
    });
});
const getBrandByOwner = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    // const excludeFields = ["name", "address", "email", "phoneNumber"];
    // const pitch = await Pitch.findById(pitchId)
    //   .populate("owner", excludeFields)
    //   .populate({
    //     path: "postedBy",
    //     select: "name avatar",
    //   });
    const brand = await Brand.findOne({ owner: userId });
    return res.status(200).json({
        success: brand ? true : false,
        brandData: brand ? brand : "Cannot get brand",
    });
});
const getBrand = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    const brand = await Brand.findById(bid).populate({
        path: "ratings",
        populate: {
            path: "postedBy",
            select: "firstname lastname avatar",
        },
    });
    return res.status(200).json({
        success: brand ? true : false,
        pitchData: brand ? brand : "Can not get pitch",
    });
});
const getBrandByTitle = asyncHandler(async (req, res) => {
    const { btitle } = req.params;
    // console.log("req.params", req.params);
    // console.log(title);
    if (!btitle) throw new Error("Missing input");
    const excludeFields = ["firstname", "lastname", "email"];
    const response = await Brand.findOne({
        title: { $regex: btitle, $options: "i" },
    })
        .populate("owner", excludeFields)
        .populate({
            path: "ratings",
            populate: {
                path: "postedBy",
                select: "firstname lastname avatar",
            },
        });
    return res.status(200).json({
        success: response ? true : false,
        BrandData: response ? response : "Cannot get brand",
    });
});

const getAllBrands = asyncHandler(async (req, res) => {
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
    // formartedQueries['$or'] = [
    //     { role: { $regex: queries.q, $options: 'i' } }
    // ]
    // Filtering
    // regex: tìm từ bắt đầu bằng chữ truyền vào
    // options: 'i' không phân biệt viết hoa viết thường
    // doc: https://www.mongodb.com/docs/manual/reference/operator/query/regex/
    if (queries?.title)
        formartedQueries.title = { $regex: queries.title, $options: "i" };

    if (req.query.q) {
        delete formartedQueries.q;
        formartedQueries["$or"] = [
            { title: { $regex: queries.q, $options: "i" } },
            { address: { $regex: queries.q, $options: "i" } },
            //   { email: { $regex: queries.q, $options: "i" } },
        ];
    }
    let queryCommand = Brand.find(formartedQueries);

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

        const counts = await Brand.find(formartedQueries).countDocuments();
        return res.status(200).json({
            success: response ? true : false,
            Brands: response ? response : "Cannot get brands",
            totalCount: counts,
        });
    });
});
module.exports = {
    createBrand,
    getBrands,
    updateBrand,
    deleteBrand,
    ratings,
    updateBrandDescription,
    updateBrandAddress,
    uploadImagesBrand,
    getBrandByOwner,
    getBrandByTitle,
    getBrand,
    getAllBrands,
};
