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
    // Add references to the images
    eyeImage: ImageSchema,
    nailImage: ImageSchema,
    tongueImage: ImageSchema
}, { timestamps: true });

// Create the patient model
const Patient = mongoose.model('Patient', PatientSchema);

module.exports = Patient;
