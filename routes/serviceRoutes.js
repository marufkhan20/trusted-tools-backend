const router = require("express").Router();
const {
  addNewServciesController,
  getAllServicesController,
  getSingleServiceController,
  dublicateServiceController,
  getSingleServiceByPackageNameController,
} = require("../controllers/serviceController");
const checkAdminAuth = require("../middlewares/adminAuthMiddleware");

// get all services
router.get("/", getAllServicesController);

// get single service
router.get("/:serviceId", getSingleServiceController);

// dublicate service
router.get("/dublicate/:serviceId", checkAdminAuth, dublicateServiceController);

// add new service
router.post("/", checkAdminAuth, addNewServciesController);

module.exports = router;
