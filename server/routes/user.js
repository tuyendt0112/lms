const router = require("express").Router();
const ctrls = require("../controllers/user");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/create", [verifyAccessToken, isAdmin], ctrls.createUser);
// router.put("/finalregister/:token", ctrls.finalRegister);
router.post("/login", ctrls.login);

router.get("/current", verifyAccessToken, ctrls.getCurrent);

router.post("/refreshtoken", ctrls.refreshAccessToken);
router.get("/logout", ctrls.logout);
router.post("/forgotpassword", ctrls.forgotPassword);
router.put("/resetpassword", ctrls.resetPassword);
router.get("/", [verifyAccessToken, isAdmin], ctrls.getUsers);
router.delete("/", [verifyAccessToken, isAdmin], ctrls.deleteUsers);
router.put("/current", [verifyAccessToken], ctrls.updateUsers);
router.put("/:uid", [verifyAccessToken, isAdmin], ctrls.updateUsersByAdmin);

module.exports = router;

//CRUD | CREATE (POST) - READ(GET) - UPDATE(PUT) - DELETE(DEL) |

//CREATE (POST) + PUT - body (k bị lộ)
//GET + DELETE - query (hiển thị)
