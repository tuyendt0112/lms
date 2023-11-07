const router = require('express').Router()
const ctrls = require('../controllers/blogCategory')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

router.post('/', [verifyAccessToken, isAdmin], ctrls.createCategory)
router.get('/', ctrls.getCategories)
router.put('/:bpcid', [verifyAccessToken, isAdmin], ctrls.updateCategory)
router.delete('/:bpcid', [verifyAccessToken, isAdmin], ctrls.deleteCategory)



module.exports = router