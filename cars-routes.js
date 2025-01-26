const express = require("express");

const { check } = require("express-validator");
const router = express.Router();

const carsController = require("../controllers/cars-controller");

router.get('/',carsController.getAllCars);




router.get("/:cid", carsController.getCarById);

router.get("/buyer/:bid", carsController.getCarsByBuyerId);

router.post(
  "/",
  check("title").not().isEmpty(),
  carsController.createCar
);

router.patch("/:cid", carsController.updateCarById);

router.delete("/:cid", carsController.deleteCarById);

module.exports = router;
