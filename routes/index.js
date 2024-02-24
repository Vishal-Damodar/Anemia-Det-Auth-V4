const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/checkAuth");
const ashaController = require('../controllers/ashaController')

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

router.get("/user_result", ensureAuthenticated, (req, res) =>
  res.render("user_result", {
    name: req.user.name,
  }),
);

router.get("/asha_login", ensureAuthenticated, (req, res) =>
  res.render("asha_login")
);

router.post('/asha_login', ashaController.registerHandle);

router.get("/doctor_login", ensureAuthenticated, (req, res) =>
  res.render("doctor_login", {
    name: req.user.name,
  }),
);

module.exports = router;
