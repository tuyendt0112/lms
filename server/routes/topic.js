const router = require("express").Router();
const ctrls = require("../controllers/topic");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

// Student
router.get("/current", verifyAccessToken, ctrls.getCurrentTopicForStudent);
router.put("/register", verifyAccessToken, ctrls.registerTopic);
// Admin
router.post("/create", [verifyAccessToken, isAdmin], ctrls.createTopic);
router.get("/", [verifyAccessToken, isAdmin], ctrls.getTopics);
router.delete("/", [verifyAccessToken, isAdmin], ctrls.deleteTopic);
router.put("/assign", [verifyAccessToken, isAdmin], ctrls.assignInstructor);
router.put(
  "/:topicId",
  [verifyAccessToken, isAdmin],
  ctrls.updateTopicsByAdmin
);

module.exports = router;
