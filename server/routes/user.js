const router = require('express').Router()
const ctrls = require('../controllers/user')

router.post('/register', ctrls.register)
router.post('/login', ctrls.login)

module.exports = router


//CRUD | CREATE (POST) - READ(GET) - UPDATE(PUT) - DELETE(DEL) | 