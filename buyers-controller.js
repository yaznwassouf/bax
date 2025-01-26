const uuid = require("uuid").v4;

const mongoose = require("mongoose");

const HttpError = require("../model/http-error");
const Buyer = require("../model/buyer");

let DUMMYBUYERS = [
  {
    id: "b1",
    name: "yazan",
    email: "yaznwassouf@gmail.com",
    password: "12345",
  },
  {
    id: "b2",
    name: "magd",
    email: "magdwassouf@gmail.com",
    password: "123456",
  },
  {
    id: "b3",
    name: "maya",
    email: "mayawassouf@gmail.com",
    password: "1234567",
  },
  {
    id: "b4",
    name: "ibrahim",
    email: "ibrahim@gmail.com",
    password: "12345678",
  },
];
const signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  let existingBuyer;

  try {
    existingBuyer = await Buyer.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("signing up failed!", 500);
    return next(error);
  }
  if(existingBuyer){
    const error = new HttpError('buyer exist already! , please login in instead', 422);
  }

  const createdBuyer = new Buyer({
    name,
    email,
    password,
    cars: []
  });
  try {
    await createdBuyer.save();
  } catch (err) {
    const error= new HttpError('signing up failed!, please try again !');
    // return next(error);      
  }

  res.json({ buyer: createdBuyer.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingBuyer;

  try {
    existingBuyer = await Buyer.findOne({ email: email });
  } catch (err) {
    const error= new HttpError('login failed', );
    return next(error);
  }

  if(!existingBuyer || existingBuyer.password !== password ){
    const error= new HttpError('email already exist', 401);
    return next(error);
  }

  res.json({ message: "successful" });
};

exports.signup = signup;

exports.login = login;
