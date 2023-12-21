const Pitch = require("../models/pitch");
const Brand = require("../models/brand");
const asyncHandler = require("express-async-handler");

const Topic = require("../models/topic");

const createTopic = asyncHandler(async (req, res) => {
  const { title, description, topicId, department, major, DateEnd, DateStart } =
    req.body;
  if (
    !title ||
    !description ||
    !topicId ||
    !department ||
    !major ||
    !DateEnd ||
    !DateStart
  )
    throw new Error("Missing inputs");
  const newTopic = await Topic.create(req.body);
  return res.status(200).json({
    success: newTopic ? true : false,
    createPitch: newTopic ? newTopic : "Can not create new topic",
  });
});
const getPitch = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const pitch = await Pitch.findById(pid).populate({
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
//filtering , sorting & pagination

const getPitches = asyncHandler(async (req, res) => {
  const queries = { ...req.query };

  // seperate special field
  const excludeFields = ["limit", "sort", "page", "fields"];
  excludeFields.forEach((el) => delete queries[el]);
  // Format operators
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (matchedEl) => `$${matchedEl}`
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
      } else {
        addressQueryObject = { $and: addressQuery };
      }
    } else {
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
    } else {
      formatedQueries["$or"] = [
        { title: { $regex: queries.q, $options: "i" } },
        { address: { $regex: queries.q, $options: "i" } },
        { category: { $regex: queries.q, $options: "i" } },
        { brand: { $regex: queries.q, $options: "i" } },
      ];
    }
  }
  const qr = { ...addressQueryObject, ...formatedQueries };

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
  const limit = +req.query.limit || process.env.LIMIT_PITCHS;
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
  });
});

const updatePitch = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const files = req?.files;
  if (files?.thumb) {
    req.body.thumb = files?.thumb[0].path;
  }
  if (files?.images) {
    req.body.thumb = files?.images?.map((el) => el.path);
  }
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const updatePitch = await Pitch.findByIdAndUpdate(pid, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: updatePitch ? true : false,
    mes: updatePitch ? "Updated" : "Can not update pitch",
  });
});
const deletePitch = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const deletePitch = await Pitch.findByIdAndDelete(pid);
  return res.status(200).json({
    success: deletePitch ? true : false,
    mes: deletePitch ? "Deleted" : "Can not delete pitch",
  });
});
module.exports = {
  createTopic,
  getPitch,
  updatePitch,
  deletePitch,
  getPitches,
};
