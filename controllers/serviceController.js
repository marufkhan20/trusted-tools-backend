const Jimp = require("jimp");
const path = require("path");
const Service = require("../model/Service");

// get all services controller
const getAllServicesController = async (req, res) => {
  try {
    const services = await Service.find({});
    // .populate(["reviews", "orders"]);

    res.status(200).json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server Error Occured!",
    });
  }
};

// get single service controller
const getSingleServiceController = async (req, res) => {
  try {
    const { serviceId } = req.params || {};

    const service = await Service.findById(serviceId);
    res.status(200).json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server Error Occured!",
    });
  }
};

// dublicate service controller
const dublicateServiceController = async (req, res) => {
  try {
    const { serviceId } = req.params || {};

    if (!serviceId) {
      return res.status(400).json({
        error: "Service Id is required!",
      });
    }

    // get service
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        error: "Service Not Found!",
      });
    }

    const newService = new Service({
      title: service?.title,
      fullDescription: service?.fullDescription,
      shortDescription: service?.shortDescription,
      serviceImages: service?.serviceImages,
      basicName: service?.basicName,
      basicPrice: service?.basicPrice,
      basicDelivery: service?.basicDelivery,
      basicRevision: service?.basicRevision,
      basicDescription: service?.basicDescription,
      standardName: service?.standardName,
      standardPrice: service?.standardPrice,
      standardDelivery: service?.standardDelivery,
      standardRevision: service?.standardRevision,
      standardDescription: service?.standardDescription,
      premiumName: service?.premiumName,
      premiumPrice: service?.premiumPrice,
      premiumDelivery: service?.premiumDelivery,
      premiumRevision: service?.premiumRevision,
      premiumDescription: service?.premiumDescription,
    });
    await newService.save();

    res.status(200).json(newService);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server Error Occured!",
    });
  }
};

// add new service controller
const addNewServciesController = async (req, res) => {
  try {
    const { serviceImages } = req.body || {};

    if (serviceImages?.length === 0) {
      return res.status(400).json({
        error: "Service images is required!",
      });
    }

    // upload image
    const imagesArr = [];

    if (serviceImages?.length > 0) {
      serviceImages?.forEach(async (image) => {
        const buffer = Buffer.from(
          image.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
          "base64"
        );

        const imagePath = `${Date.now()}-${Math.round(
          Math.random() * 1e9
        )}.png`;

        try {
          const jimpResp = await Jimp.read(buffer);
          jimpResp
            .resize(1000, 620)
            .write(
              path.resolve(__dirname, `../public/storage/services/${imagePath}`)
            );

          imagesArr.push(`/storage/services/${imagePath}`);
        } catch (err) {
          return res.status(500).json({
            error: "Could not process the image!!",
          });
        }
      });
    }

    setTimeout(async () => {
      // create new service
      const newService = new Service({
        ...req.body,
        serviceImages: imagesArr,
      });

      await newService.save();

      return res.status(201).json(newService);
    }, [200]);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Server Error Occured",
    });
  }
};

// delete service controller
const deleteServiceController = async (req, res) => {
  try {
    const { id } = req.params || {};

    const deletedService = await Service.findByIdAndDelete(id);
    res.status(200).json(deletedService);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Server Error Occured",
    });
  }
};

module.exports = {
  getAllServicesController,
  getSingleServiceController,
  dublicateServiceController,
  addNewServciesController,
  deleteServiceController,
};
