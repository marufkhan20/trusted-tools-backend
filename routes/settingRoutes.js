const router = require("express").Router();
const checkAdminAuth = require("../middlewares/adminAuthMiddleware");

// update logo
router.patch("/:id", checkAdminAuth);

module.exports = router;
