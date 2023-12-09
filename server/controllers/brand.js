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
    const { brandId } = req.params;
    // find old title
    const oldBrand = await Brand.findById(brandId);
    const oldTitle = oldBrand.title;
    if (req.body && req.body.title) req.body.slug = createSlug(req.body.title); // update slug
    const updatedBrand = await Brand.findByIdAndUpdate(brandId, req.body, {
        new: true,
    });
    // update pitchCategory
    const categories = updatedBrand.categories;
    await Promise.all(
        categories.map(async (categoryTitle) => {
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
        updatedBrand: updatedBrand ? updatedBrand : "Cannot update brand",
    });
});
const deleteBrand = asyncHandler(async (req, res) => {
    const { brandId } = req.params;

    // find old title
    const deletedBrand = await Brand.findById(brandId);
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

    const response = await Brand.findByIdAndDelete(brandId);
    return res.status(200).json({
        success: response ? true : false,
        deletedBrand: response ? response : "Cannot delete brand",
    });
});

const ratings = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, comment, brandId } = req.body;
    if (!star || !brandId) throw new Error("Missing input");
    const ratingBrand = await Brand.findById(brandId);
    const alreadyRating = ratingBrand?.ratings?.find(
        (el) => el.postedBy.toString() === _id
    );
    if (alreadyRating) {
        // update rating
        await Brand.updateOne(
            {
                ratings: { $elemMatch: alreadyRating },
            },
            {
                $set: { "ratings.$.star": star, "ratings.$.comment": comment },
            },
            { new: true }
        );
    } else {
        // add star and comment
        await Brand.findByIdAndUpdate(
            brandId,
            {
                $push: { ratings: { star, comment, postedBy: _id } },
            },
            { new: true }
        );
    }
    // sum ratings
    const updateBrand = await Pitch.findById(brandId);

    const ratingCount = updateBrand.ratings.length;

    const sumRatings = updateBrand.ratings.reduce((sum, el) => sum + +el.star, 0);

    updateBrand.totalRatings = Math.round((sumRatings * 10) / ratingCount) / 10;
    await updateBrand.save();

    return res.status(200).json({
        status: true,
        updateBrand,
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
};