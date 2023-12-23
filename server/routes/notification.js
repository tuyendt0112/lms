const router = require('express').Router()
const ctrls = require('../controllers/notification')
const { verifyAccessToken, isAdmin, isAdminAndPitchOwn } = require('../middlewares/verifyToken')

router.post('/', [verifyAccessToken, isAdminAndPitchOwn], ctrls.createNotification)
router.get("/", ctrls.getAllNotification);
router.put('/', [verifyAccessToken, isAdminAndPitchOwn], ctrls.updateNotification)
router.delete('/:nid', [verifyAccessToken, isAdminAndPitchOwn], ctrls.deleteNotification)


module.exports = router