const uuid = require("uuid").v4;

const mongoose = require("mongoose");

const Car = require("../model/car");

const Buyer = require("../model/buyer");
const HttpError = require("../model/http-error");

// let DUMMYCARS = [
//     { id: "c1", title: "mercedes", descreption: "wonderful car" ,buyer: 'b1'},
//     { id: "c2", title: "bmw", descreption: "amazing car" ,buyer:'b1'},
//     { id: "c3", title: "toyota", descreption: "nice car",buyer:'b1' },
//     { id: "c4", title: "ford", descreption: "good car",buyer:'b2' },
//     { id: "c5", title: "porsha", descreption: "beautifull car" , buyer:'b2'},
//   ];

const getAllCars =async  (req, res, next) => {
  let cars; 
  try{

    cars= await Car.find({}, make, model, year, buyer).populate('buyer')

  }catch(err){
    return next(new HttpError('can not find the all cars', 500))
  }

  res.json({cars: cars.map(car => car.toObject({getters: true}))});
};

const getCarById = async (req, res, next) => {
  const carid = req.params.cid;

  let car;
  try {
    car = await Car.findById(carid);
  } catch (err) {
    return next(new HttpError('some thing went wrong, could not find the place ',500))
  }

  res.json({ car: car.toObject({ getters: true }) });
};

const getCarsByBuyerId = async (req, res, next) => {
  const buyerId = req.params.bid;

  // let cars;
  let userwithcar;
  try {
    userwithcar = await Buyer.findById(buyerId).populate('cars');
  } catch (err) {
    const error= new HttpError('error to fetch cars', 500);

    return next(error);
  }

  if(!userwithcar || userwithcar.cars.length === 0){
    return next (new HttpError('can not find the cars for provided buyer id!',404))
  }

  res.json({ cars: userwithcar.cars.map((car) => car.toObject({ getters: true })) });
};

const createCar = async (req, res, next) => {
  const { make, model, year, buyer } = req.body;
  const createdCar = new Car({
    make,
    model,
    year,
    buyer,
  });

  let user; // he could be a buyer but the destructuring has a diffrent opinion

  try {
    user = await Buyer.findById(buyer);
  } catch (err) {
    const error = new HttpError("creating car failed! ", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("can not find the buyer", 404);
    return next(error);
  }

  console.log(user);

  try {
    const sess = await mongoose.startSession();
    await sess.startTransaction();
    createdCar.save({ session: sess });
    user.cars.push(createdCar);
    user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("creating car failed!, please try again ", 500);
    return next(error);
  }
  res.json({ Car: createdCar });
};

const updateCarById = async (req, res, next) => {
  const { make, model, year } = req.body;
  const carId = req.params.cid;
  let car;
  try {
    car = await Car.findById(carId);
  } catch (err) {
    console.log("can not update th car!");
  }

  car.make = make;
  car.model = model;
  car.year = year;
  try {
    await car.save();
  } catch (err) {
    console.log("can not save the updated car");
  }

  res.json({ car: car.toObject({ getters: true }) });
};

const deleteCarById = async (req, res, next) => {

  const carId = req.params.cid;
  let car;
  try {
    car = await Car.findById(carId).populate('buyer')
  } catch (err) {
    const error = new HttpError(
      "some thing went wrong! , could not delete place",
      500
    );

    return next(error);
  }

  if (!car) {
    const error = new HttpError("could not find the car!", 404);

    return next(error);
  }

  try {
    const sess = mongoose.startSession();
    await sess.startTransaction();
     car.deleteOne({session: sess});
     car.buyer.cars.pull();
     car.buyer.save({ session: sess });
    await sess.commitTransaction();
    // await car.deleteOne();
  } catch (err) {
    const error = new HttpError("could nout find the car ", 404);
  }

  res.json({ message: "deleted successfully!" });
};

exports.getCarById = getCarById;
exports.getCarsByBuyerId = getCarsByBuyerId;
exports.createCar = createCar;
exports.updateCarById = updateCarById;
exports.deleteCarById = deleteCarById;
exports.getAllCars = getAllCars;
