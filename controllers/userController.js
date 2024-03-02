const Patient = require("../models/Patient");

exports.getUserResult = async (req, res) => {
  try {
    const aadhar = req.query.aadhar;

    const patient = await Patient.findOne({ aadhar });

    if (!patient) {
      return res.render("user_result", { error: "Patient not found" });
    }
    patient.testResults.sort((a, b) => b.testDate - a.testDate);
    res.render("user_result", { patient });
  } catch (err) {
    console.error(err);
    res.render("user_result", {
      error: "An error occurred. Please try again later.",
    });
  }
};
