const router = require('express').Router()
const ctrls = require('../controllers/pitchCategory')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')
const uploader = require('../config/cloudinaryconfig')

router.post('/', [verifyAccessToken, isAdmin], ctrls.createCategory)
router.get('/', ctrls.getCategories)
router.put('/uploadimage/:pcid', [verifyAccessToken, isAdmin], uploader.array('images', 10), ctrls.uploadImagesCategories)
router.put('/:pcid', [verifyAccessToken, isAdmin], ctrls.updateCategory)
router.delete('/:pcid', [verifyAccessToken, isAdmin], ctrls.deleteCategory)



module.exports = router