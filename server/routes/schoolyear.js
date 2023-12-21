const router = require('express').Router()
const ctrls = require('../controllers/schoolyear')
const { verifyAccessToken, isAdmin, isAdminAndPitchOwn } = require('../middlewares/verifyToken')

router.post('/', [verifyAccessToken, isAdmin], ctrls.createSchoolYear)
router.get('/', [verifyAccessToken, isAdmin], ctrls.getSchoolYears)

module.exports = router