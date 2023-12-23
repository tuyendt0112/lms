const Notification = require("../models/notification");
const asyncHandler = require("express-async-handler");

const createNotification = asyncHandler(async (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) throw new Error("Missing inputs!!");
    const response = await Notification.create(req.body);
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? "Create notification success" : "Cannot create new Notification",
    });
});
const getAllNotification = asyncHandler(async (req, res) => {
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
    // regex: tìm từ bắt đầu bằng chữ truyền vào
    // options: 'i' không phân biệt viết hoa viết thường
    // doc: https://www.mongodb.com/docs/manual/reference/operator/query/regex/
    if (queries?.title)
        formartedQueries.title = { $regex: queries.title, $options: "i" };

    if (req.query.q) {
        delete formartedQueries.q;
        formartedQueries["$or"] = [{ title: { $regex: queries.q, $options: "i" } }];
    }
    let queryCommand = Notification.find(formartedQueries);

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

        const counts = await Notification.find(formartedQueries).countDocuments();
        return res.status(200).json({
            success: response ? true : false,
            Notifications: response ? response : "Cannot get brands",
            totalCount: counts,
        });
    });
});
const deleteNotification = asyncHandler(async (req, res) => {
    const { nid } = req.params;
    const response = await Notification.findByIdAndDelete(nid);
    return res.status(200).json({
        success: response ? true : false,
        message: response ? "Deleted" : "Cannot delete notification",
    });
});
const updateNotification = asyncHandler(async (req, res) => {
    const { nid } = req.body
    const updateNotification = await Pitch.findByIdAndUpdate(nid, req.body, { new: true })
    return res.status(200).json({
        success: updateNotification ? true : false,
        mes: updateNotification ? "Updated" : 'Can not update notification'
    })
});

module.exports = {
    createNotification,
    getAllNotification,
    deleteNotification,
    updateNotification,
};
