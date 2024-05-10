const Patient = require("../models/Patient");

exports.getPatients = async (req, res) => {
  try {
      const patients = await Patient.find();

      const formattedPatients = patients.map(patient => ({
          name: patient.name,
          city: patient.city,
          testResults: patient.testResults.map(testResult => ({
              testDate: testResult.testDate,
              result: testResult.result,
              testedBy: testResult.testedBy
          }))
      }));

      return(formattedPatients);
  } catch (error) {
      console.error('Error fetching patients data:', error);
  }
};
