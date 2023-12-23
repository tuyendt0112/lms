const router = require("express").Router();
const ctrls = require("../controllers/topic");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");


router.post("/", [verifyAccessToken, isAdmin], ctrls.createTopic);
router.get("/", ctrls.getTopics);
router.delete('/:pid', [verifyAccessToken, isAdmin], ctrls.deleteTopic)
router.put('/:pid', [verifyAccessToken, isAdmin], ctrls.updateTopic)

module.exports = router;
