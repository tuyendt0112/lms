const router = require("express").Router();
const ctrls = require("../controllers/topic");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");


router.post("/", [verifyAccessToken, isAdmin], ctrls.createTopic);
router.get("/", ctrls.getTopics);
router.put('/register/:pid', [verifyAccessToken], ctrls.registerTopic)
router.put('/undoregister/:pid', [verifyAccessToken], ctrls.unRegisterTopic)
router.delete('/:pid', [verifyAccessToken, isAdmin], ctrls.deleteTopic)
router.put('/:pid', [verifyAccessToken, isAdmin], ctrls.updateTopic)
router.get('/:pid', ctrls.getTopic)

module.exports = router;
