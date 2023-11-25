const Topic = require("../models/topic");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const { ObjectId } = require("bson");
// ObjectId = require("mongodb").ObjectID;
const createTopic = asyncHandler(async (req, res) => {
  const { title, topicId, department, major, description } = req.body;
  if (!title || !topicId || !department || !major || !description)
    return res.status(400).json({
      success: false,
      mes: "Missing inputs",
    });

  const newTopic = await Topic.create(req.body);
  return res.status(200).json({
    success: newTopic ? true : false,
    createdTopic: newTopic ? "create is sucessfully" : "Something went wrong",
  });
});

const getTopics = asyncHandler(async (req, res) => {
  const response = await Topic.find()
    .populate("major", "title -_id")
    .populate("department", "title -_id")
    .populate("students", "name -_id");
  return res.status(200).json({
    success: response ? true : false,
    topics: response,
  });
});
const deleteTopic = asyncHandler(async (req, res) => {
  const { topicId } = req.query;
  if (!topicId) throw new Error("Topic not match");
  const response = await Topic.findByIdAndDelete(topicId);
  return res.status(200).json({
    success: response ? true : false,
    deletedTopic: response
      ? `Topic with title ${response.title} has been deleted `
      : "No topic deleted",
  });
});
const updateTopicsByAdmin = asyncHandler(async (req, res) => {
  const { topicId } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
  const response = await Topic.findByIdAndUpdate(topicId, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: response ? true : false,
    updatedTopic: response ? response : "Can not update",
  });
});
// send file
// const sendFiles = asyncHandler(async (req, res) => {
//   const { _id } = req.user;
//   if (!_id || Object.keys(req.body).length === 0)
//     throw new Error("Missing inputs");
//   const response = await User.findByIdAndUpdate(_id, req.body, {
//     new: true,
//   }).select("-password -role -refreshToken");
//   return res.status(200).json({
//     success: response ? true : false,
//     updateddUsers: response ? response : "Can not update",
//   });
// });

// register
const registerTopic = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { topicId } = req.body;
  const topic = await Topic.findByIdAndUpdate(
    topicId,
    {
      $push: { students: { _id } },
    },
    { new: true }
  );
  return res.status(200).json({
    success: topic ? true : false,
    topic: topic ? topic : "topic not found",
  });
});
const assignInstructor = asyncHandler(async (req, res) => {
  const { topicId, teacherId } = req.body;
  console.log("first");
  const id = new ObjectId(teacherId);
  console.log(typeof teacherId, "teacherId");
  console.log(typeof id, "id");
  // Chuyển đổi chuỗi thành ObjectId
  //   let teacherObjectId = ObjectId(`${teacherId}`);

  const topic = await Topic.findByIdAndUpdate(
    topicId,
    {
      $push: { instructors: { id } },
    },
    { new: true }
  );

  return res.status(200).json({
    success: topic ? true : false,
    topic: topic ? topic : "topic not found",
  });
});
// dk : student phai dang ky it nhat 1 topic
const getCurrentTopicForStudent = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const topic = await Topic.find({ students: { $all: _id } }).select(
    "title -_id"
  );
  // .populate("major", "title -_id")
  // .populate("department", "title -_id");
  return res.status(200).json({
    success: topic ? true : false,
    topic: topic ? topic : "topic not found",
  });
});

module.exports = {
  createTopic,
  registerTopic,
  getTopics,
  deleteTopic,
  updateTopicsByAdmin,
  getCurrentTopicForStudent,
  assignInstructor,
  //   finalRegister,
};
