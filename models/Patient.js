const mongoose = require('mongoose');

// Define a schema for storing the images
const ImageSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    bodyPart: {
        type: String,
        enum: ['Eye', 'Nail', 'Tongue'], // Enum to restrict body part values
        required: true
    }
});

// Define the patient schema
const PatientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    aadhar: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        default: true
    },
    city: {
        type: String,
        default: true
    },
    state: {
        type: String,
        default: true
    },
    // Array to store test results
    testResults: [
        {
            testDate: {
                type: Date,
                default: Date.now
            },
            testType: {
                type: String,
                required: true
            },
            result: {
                type: String,
                required: true
            },
            // Add references to the images for this test result
          images: [ImageSchema],
          testedBy: {
                type: String,
                required: true
          }
        }
    ]
}, { timestamps: true });

// Create the patient model
const Patient = mongoose.model('Patient', PatientSchema);

module.exports = Patient;
