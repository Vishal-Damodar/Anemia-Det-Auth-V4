const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/checkAuth");
const { ensureUser } = require("../controllers/userController");
const { getRegistrationStatistics } = require("../controllers/ashaController");
const { fetchTestResultsByTester } = require("../controllers/ashaController");
const { getPatients } = require("../controllers/doctorController");
const ashaController = require("../controllers/ashaController");
const userController = require("../controllers/userController");
const upload = require("../server");
const Patient = require("../models/Patient");

//------------ Welcome Route ------------//s
router.get("/", (req, res) => {
    res.send("welcome");
});

//------------ Dashboard Route ------------//
router.get("/dashboard", ensureAuthenticated, (req, res) =>
    res.json({
        dash: {
            name: req.user.name,
        },
    }),
);

// router.get("/user_result", (req, res) => {
//   const aadhar = req.query.aadhar; // Retrieve the Aadhar number from the query parameters
//   res.render("user_result", { aadhar }); // Pass the Aadhar number to the 'user_result' view
// });

router.get("/user_result", userController.getUserResult);

router.get("/asha_login", ensureAuthenticated, async (req, res) => {
    try {
        console.log("asha_login");
        const loggedInUser = req.user; // Access the logged-in user's information from req.user
        console.log(loggedInUser);
        const registrationStatistics = await getRegistrationStatistics(
            loggedInUser.email,
        ); // Fetch registration statistics
        res.json({
            asha_login: { user: loggedInUser, registrationStatistics },
        }); // Render asha_login page with user info and statistics
    } catch (error) {
        console.error("Error rendering asha_login:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get(
    "/asha_login/view_patients",
    ensureAuthenticated,
    async (req, res) => {
        try {
            const loggedInUser = req.user;

            // Call the fetchTestResultsByTester function to fetch data
            const testResults = await fetchTestResultsByTester(
                loggedInUser.email,
            );

            // Send the fetched data to the frontend as JSON
            res.json({ user: loggedInUser.email, testResults });
        } catch (error) {
            console.error("Error rendering asha_login:", error);
            res.status(500).send("Internal Server Error");
        }
    },
);

router.get(
    "/asha_login/view_patients/:id",
    ensureAuthenticated,
    async (req, res) => {
        try {
            const aadhar = req.params.id;

            const patient = await Patient.findOne({ aadhar });
            console.log(aadhar);

            if (!patient) {
                return res.status(404).json({ message: "Patient not found" });
            }

            res.json(patient);
        } catch (error) {
            console.error("Error fetching patient details:", error);
            res.status(500).send("Internal Server Error");
        }
    },
);

router.post(
    "/asha_login",
    upload.fields([
        { name: "eyeImageData", maxCount: 1 },
        { name: "nailImageData", maxCount: 1 },
        { name: "tongueImageData", maxCount: 1 },
    ]),
    ashaController.registerHandle,
);

router.get("/doctor_login", ensureAuthenticated, async (req, res) => {
    try {
        const loggedInUser = req.user;

        // Call the fetchTestResultsByTester function to fetch data
        const viewPatients = await getPatients();

        // Send the fetched data to the frontend as JSON
        res.json(viewPatients);
    } catch (error) {
        console.error("Error rendering asha_login:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
