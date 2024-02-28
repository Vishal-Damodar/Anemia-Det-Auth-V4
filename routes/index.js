const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/checkAuth");
const { ensureUser} = require('../controllers/userController');
const ashaController = require('../controllers/ashaController')
const userController = require('../controllers/userController')
const upload = require('../server');

//------------ Welcome Route ------------//
router.get("/", (req, res) => {
  res.render("welcome");
});

//------------ Dashboard Route ------------//
router.get("/dashboard", ensureAuthenticated, (req, res) =>
  res.render("dash", {
    name: req.user.name,
  }),
);

router.get("/user_result", (req, res) => {
  const aadhar = req.query.aadhar; // Retrieve the Aadhar number from the query parameters
  res.render("user_result", { aadhar }); // Pass the Aadhar number to the 'user_result' view
});

router.get("/asha_login", ensureAuthenticated, (req, res) =>
  res.render("asha_login")
);

router.post('/asha_login', upload.fields([
    { name: 'eyeImageData', maxCount: 1 },
    { name: 'nailImageData', maxCount: 1 },
    { name: 'tongueImageData', maxCount: 1 }
]), ashaController.registerHandle);

router.get("/doctor_login", ensureAuthenticated, (req, res) =>
  res.render("doctor_login", {
    name: req.user.name,
  }),
);

module.exports = router;
