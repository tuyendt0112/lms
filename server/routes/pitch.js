const router = require('express').Router()
const ctrls = require('../controllers/pitch')
const { verifyAccessToken, isAdmin, isAdminAndPitchOwn } = require('../middlewares/verifyToken')
const uploader = require('../config/cloudinaryconfig')

router.post('/', [verifyAccessToken, isAdminAndPitchOwn], ctrls.createPitch)
router.get('/', ctrls.getPitchs)
router.put('/ratings', [verifyAccessToken], ctrls.ratings)

router.put('/uploadimage/:pid', [verifyAccessToken, isAdmin], uploader.array('images', 10), ctrls.uploadImagesPitch)
router.put('/:pid', [verifyAccessToken, isAdminAndPitchOwn], ctrls.updatePitch)
router.delete('/:pid', [verifyAccessToken, isAdminAndPitchOwn], ctrls.deletePitch)
router.get('/:pid', ctrls.getPitch)


module.exports = router