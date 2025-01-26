const express = require("express");

const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const carsRoutes = require("./routes/cars-routes");
const buyerRoutes = require("./routes/buyers-routes");
const app = express();
app.use(bodyParser.json());

app.use("/api/cars", carsRoutes);
app.use("/api/buyer", buyerRoutes);

mongoose
  .connect('mongodb://localhost:27017/cars_database')
  .then(() => {
    app.listen(5000, () => {
      console.log("Server is running on http://localhost:5000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
