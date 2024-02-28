const Patient = require('../models/Patient');
const fs = require('fs');

exports.registerHandle = async (req, res) => {
  console.log("Entered registerHandle");
  console.log(req.body)

  // Access uploaded images from req.files object
  const eyeImageData = req.files['eyeImageData'][0]; // Assuming single file upload
  const nailImageData = req.files['nailImageData'][0];
  const tongueImageData = req.files['tongueImageData'][0];

 
  
    const { name, gender, aadhar, phone, city, state } = req.body;
  // const { eyeImage, nailImage, tongueImage } = req.files; // Access uploaded files
    let errors = [];

    // Checking required fields
    if (!name || !gender || !aadhar || !phone || !city || !state) {
        errors.push({ msg: 'Please enter all fields.' });
    }

    // If there are errors, render the form with error messages
    if (errors.length > 0) {
        req.flash('error_msg', 'Please enter all fields.');
        return res.render('asha_login', {
            errors,
            name,
            gender,
            aadhar,
            phone,
            city,
            state
        });
    }

    try {
        const newPatient = new Patient({
            name,
            gender,
            aadhar,
            phone,
            city,
            state
        });

    

      
       console.log(eyeImageData);
          newPatient.eyeImage = { url: eyeImageData.path, bodyPart: 'Eye' };
      

     
          newPatient.nailImage = { url: nailImageData.path, bodyPart: 'Nail' };
      

      
          newPatient.tongueImage = { url: tongueImageData.path, bodyPart: 'Tongue' };
      

        await newPatient.save();

        req.flash('success_msg', 'Patient Registered.');
      console.log("Patient Registered");
        res.redirect('/asha_login');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'An error occurred. Please try again later.');
        res.redirect('/asha_login');
    }
};
