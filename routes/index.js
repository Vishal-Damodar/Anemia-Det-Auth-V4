const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/checkAuth");
const { ensureUser} = require('../controllers/userController');
const { getRegistrationStatistics } = require('../controllers/ashaController')
const ashaController = require('../controllers/ashaController')
const userController = require('../controllers/userController')
const upload = require('../server');

//------------ Welcome Route ------------//s
router.get("/", (req, res) => {
  res.render("welcome");
});

//------------ Dashboard Route ------------//
router.get("/dashboard", ensureAuthenticated, (req, res) =>
  res.render("dash", {
    name: req.user.name,
  }),
);

// router.get("/user_result", (req, res) => {
//   const aadhar = req.query.aadhar; // Retrieve the Aadhar number from the query parameters
//   res.render("user_result", { aadhar }); // Pass the Aadhar number to the 'user_result' view
// });

router.get("/user_result", userController.getUserResult);

router.get('/asha_login', ensureAuthenticated, async (req, res) => {
    try {
        const loggedInUser = req.user; // Access the logged-in user's information from req.user
        const registrationStatistics = await getRegistrationStatistics(loggedInUser.email); // Fetch registration statistics
        res.render('asha_login', { user: loggedInUser, registrationStatistics }); // Render asha_login page with user info and statistics
    } catch (error) {
        console.error('Error rendering asha_login:', error);
        res.status(500).send('Internal Server Error');
    }
});

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
