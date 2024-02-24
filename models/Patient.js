const mongoose = require('mongoose');

//------------ User Schema ------------//
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
  }
}, { timestamps: true });

const Patient = mongoose.model('Patient', PatientSchema);

module.exports = Patient;