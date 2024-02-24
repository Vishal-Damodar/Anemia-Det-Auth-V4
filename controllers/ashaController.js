const Patient = require('../models/Patient');

exports.registerHandle = (req, res) => {
  const { name, gender, aadhar, phone, city, state } = req.body;
  let errors = [];
  //------------ Checking required fields ------------//
  if (!name || !gender || !aadhar || !phone || !city || !state) {
      errors.push({ msg: 'Please enter all fields.' });
  }


  if (errors.length > 0) {
    req.flash('error_msg','Please enter all fields.');
    res.render('asha_login', {
          errors,
          name,
          gender,
          aadhar,
          phone,
          city,
          state
      });   
  } 
  else {
    const newPatient = new Patient({
      name,
      gender,
      aadhar,
      phone,
      city,
      state
    });
    newPatient.save()
    .then(patient => {
        req.flash(
            'success_msg',
            'Patient Registered.'
        );
        res.render('/asha_login'); 
    })
    .catch(err => {
        console.log(err);
        req.flash(
            'error_msg',
            'An error occurred. Please try again later.'
        );
        res.redirect('/asha_login'); 
    });
  }
  
}