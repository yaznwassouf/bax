const express = require("express");

const router = express.Router();

const buyersController = require('../controllers/buyers-controller');








router.post('/signup',buyersController.signup);

router.post('/login',buyersController.login);




module.exports = router;
