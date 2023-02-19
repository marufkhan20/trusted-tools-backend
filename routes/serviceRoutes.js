const router = require("express").Router();
const {
  addNewServciesController,
  getAllServicesController,
  getSingleServiceController,
  dublicateServiceController,
  deleteServiceController,
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

// delete service
router.delete("/:id", checkAdminAuth, deleteServiceController);

module.exports = router;
