const passport = require('passport');
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const jwt = require('jsonwebtoken');
const JWT_KEY = "jwtactivekey987";
const JWT_RESET_KEY = "jwtresetkey987";

//------------ User Model ------------//
const User = require('../models/User');
const Patient = require('../models/Patient');

//------------ Register Handle ------------//
exports.registerHandle = (req, res) => {
    const { name, email, password, password2, role } = req.body;
    let errors = [];
    
    //------------ Checking required fields ------------//
    if (!name || !email || !password || !password2 || !role) {
        errors.push({ msg: 'Please enter all fields' });
    }

    //------------ Checking password mismatch ------------//
    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    //------------ Checking password length ------------//
    if (password.length < 8) {
        errors.push({ msg: 'Password must be at least 8 characters' });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2,
            role
        });;
    } else {
        //------------ Validation passed ------------//
        User.findOne({ email: email }).then(user => {
            if (user) {
                //------------ User already exists ------------//
                errors.push({ msg: 'Email ID already registered' });
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2, 
                    role
                });
            } else {
                const oauth2Client = new OAuth2(
                    "730525504291-364glkh8qkqtl67l8sfeoaipfvu95qop.apps.googleusercontent.com", // ClientID
                    "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", // Client Secret
                    "https://developers.google.com/oauthplayground" // Redirect URL
                );

                oauth2Client.setCredentials({
                    refresh_token: "1//04IA7nIH9YCGmCgYIARAAGAQSNwF-L9Ir6AHg2sSAzPRKsNo5YKpgzaSI9yyYffPrXWtGYqdFq8-OIMiEHFnVSzhKSZjW9zUVu_0"
                });
                const accessToken = oauth2Client.getAccessToken()

                const token = jwt.sign({ name, email, password, role}, JWT_KEY, { expiresIn: '30m' });
                const CLIENT_URL = 'http://' + req.headers.host;

              const output = `
                  <center><h1>Verification Email</h1></center>
                  <p>A new account has been registered with the following details:</p>
                  <ul>
                      <li><h3>Name: ${name} </h3></li>
                      <li><h3>Email: ${email} </h3></li>
                      <li><h3>Role: ${role} </h3></li>
                  </ul>
                  <p>Please click the button below to activate the account:</p>
                  <center><a href="${CLIENT_URL}/auth/activate/${token}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Activate Account</a></center>
                  <p><b>NOTE: </b>The activation link expires in 30 minutes.</p>`;

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        type: "OAuth2",
                        user: "4mh20cs116@gmail.com",
                        clientId: "730525504291-364glkh8qkqtl67l8sfeoaipfvu95qop.apps.googleusercontent.com",
                        clientSecret: "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",
                        refreshToken: "1//04IA7nIH9YCGmCgYIARAAGAQSNwF-L9Ir6AHg2sSAzPRKsNo5YKpgzaSI9yyYffPrXWtGYqdFq8-OIMiEHFnVSzhKSZjW9zUVu_0",
                        accessToken: accessToken
                    },
                });

                // send mail with defined transport object
                const mailOptions = {
                    from: '"Auth Admin" <4mh20cs116@gmail.com>', // sender address
                    to: "4mh20cs116@gmail.com", // list of receivers
                    subject: "Account Verification: NodeJS Auth ✔", // Subject line
                    generateTextFromHTML: true,
                    html: output, // html body
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                        req.flash(
                            'error_msg',
                            'Something went wrong on our end. Please register again.'
                        );
                        res.redirect('/auth/login');
                    }
                    else {
                        console.log('Mail sent : %s', info.response);
                        req.flash(
                            'success_msg',
                            'Activation link sent to email ID. Please activate to log in.'
                        );
                        res.redirect('/auth/login');
                    }
                })

            }
        });
    }
}

//------------ Activate Account Handle ------------//
exports.activateHandle = (req, res) => {
    const token = req.params.token;
    let errors = [];
    if (token) {
        jwt.verify(token, JWT_KEY, (err, decodedToken) => {
            if (err) {
                req.flash(
                    'error_msg',
                    'Incorrect or expired link! Please register again.'
                );
                res.redirect('/auth/register');
            }
            else {
                const { name, email, password, role} = decodedToken;
                User.findOne({ email: email }).then(user => {
                    if (user) {
                        //------------ User already exists ------------//
                        req.flash(
                            'error_msg',
                            'Email ID already registered! Please log in.'
                        );
                        res.redirect('/auth/login');
                    } else {
                        const newUser = new User({
                            name,
                            email,
                            password,
                            role
                        });

                        bcryptjs.genSalt(10, (err, salt) => {
                            bcryptjs.hash(newUser.password, salt, (err, hash) => {
                                if (err) throw err;
                                newUser.password = hash;
                                newUser
                                    .save()
                                    .then(user => {
                                        req.flash(
                                            'success_msg',
                                            'Account activated. You can now log in.'
                                        );
                                        res.redirect('/auth/login');
                                    })
                                    .catch(err => console.log(err));
                            });
                        });
                    }
                });
            }

        })
    }
    else {
        console.log("Account activation error!")
    }
}

//------------ Forgot Password Handle ------------//
exports.forgotPassword = (req, res) => {
    const { email } = req.body;

    let errors = [];

    //------------ Checking required fields ------------//
    if (!email) {
        errors.push({ msg: 'Please enter an email ID' });
    }

    if (errors.length > 0) {
        res.render('forgot', {
            errors,
            email
        });
    } else {
        User.findOne({ email: email }).then(user => {
            if (!user) {
                //------------ User already exists ------------//
                errors.push({ msg: 'User with Email ID does not exist!' });
                res.render('forgot', {
                    errors,
                    email
                });
            } else {

                const oauth2Client = new OAuth2(
                    "730525504291-364glkh8qkqtl67l8sfeoaipfvu95qop.apps.googleusercontent.com", // ClientID
                    "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", // Client Secret
                    "https://developers.google.com/oauthplayground" // Redirect URL
                );

                oauth2Client.setCredentials({
                    refresh_token: "1//04IA7nIH9YCGmCgYIARAAGAQSNwF-L9Ir6AHg2sSAzPRKsNo5YKpgzaSI9yyYffPrXWtGYqdFq8-OIMiEHFnVSzhKSZjW9zUVu_0"
                });
                const accessToken = oauth2Client.getAccessToken()

                const token = jwt.sign({ _id: user._id }, JWT_RESET_KEY, { expiresIn: '30m' });
                const CLIENT_URL = 'http://' + req.headers.host;
                const output = `
                <h2>Please click on below link to reset your account password</h2>
                <p>${CLIENT_URL}/auth/forgot/${token}</p>
                <p><b>NOTE: </b> The activation link expires in 30 minutes.</p>
                `;

                User.updateOne({ resetLink: token }, (err, success) => {
                    if (err) {
                        errors.push({ msg: 'Error resetting password!' });
                        res.render('forgot', {
                            errors,
                            email
                        });
                    }
                    else {
                        const transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                type: "OAuth2",
                                user: "4mh20cs116@gmail.com",
                                clientId: "730525504291-364glkh8qkqtl67l8sfeoaipfvu95qop.apps.googleusercontent.com",
                                clientSecret: "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",
                                refreshToken: "1//04IA7nIH9YCGmCgYIARAAGAQSNwF-L9Ir6AHg2sSAzPRKsNo5YKpgzaSI9yyYffPrXWtGYqdFq8-OIMiEHFnVSzhKSZjW9zUVu_0",
                                accessToken: accessToken
                            },
                        });

                        // send mail with defined transport object
                        const mailOptions = {
                            from: '"Auth Admin" <4mh20cs116@gmail.com>', // sender address
                            to: email, // list of receivers
                            subject: "Account Password Reset: NodeJS Auth ✔", // Subject line
                            html: output, // html body
                        };

                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                console.log(error);
                                req.flash(
                                    'error_msg',
                                    'Something went wrong on our end. Please try again later.'
                                );
                                res.redirect('/auth/forgot');
                            }
                            else {
                                console.log('Mail sent : %s', info.response);
                                req.flash(
                                    'success_msg',
                                    'Password reset link sent to email ID. Please follow the instructions.'
                                );
                                res.redirect('/auth/login');
                            }
                        })
                    }
                })

            }
        });
    }
}

//------------ Redirect to Reset Handle ------------//
exports.gotoReset = (req, res) => {
    const { token } = req.params;

    if (token) {
        jwt.verify(token, JWT_RESET_KEY, (err, decodedToken) => {
            if (err) {
                req.flash(
                    'error_msg',
                    'Incorrect or expired link! Please try again.'
                );
                res.redirect('/auth/login');
            }
            else {
                const { _id } = decodedToken;
                User.findById(_id, (err, user) => {
                    if (err) {
                        req.flash(
                            'error_msg',
                            'User with email ID does not exist! Please try again.'
                        );
                        res.redirect('/auth/login');
                    }
                    else {
                        res.redirect(`/auth/reset/${_id}`)
                    }
                })
            }
        })
    }
    else {
        console.log("Password reset error!")
    }
}


exports.resetPassword = (req, res) => {
    var { password, password2 } = req.body;
    const id = req.params.id;
    let errors = [];

    //------------ Checking required fields ------------//
    if (!password || !password2) {
        req.flash(
            'error_msg',
            'Please enter all fields.'
        );
        res.redirect(`/auth/reset/${id}`);
    }

    //------------ Checking password length ------------//
    else if (password.length < 8) {
        req.flash(
            'error_msg',
            'Password must be at least 8 characters.'
        );
        res.redirect(`/auth/reset/${id}`);
    }

    //------------ Checking password mismatch ------------//
    else if (password != password2) {
        req.flash(
            'error_msg',
            'Passwords do not match.'
        );
        res.redirect(`/auth/reset/${id}`);
    }

    else {
        bcryptjs.genSalt(10, (err, salt) => {
            bcryptjs.hash(password, salt, (err, hash) => {
                if (err) throw err;
                password = hash;

                User.findByIdAndUpdate(
                    { _id: id },
                    { password },
                    function (err, result) {
                        if (err) {
                            req.flash(
                                'error_msg',
                                'Error resetting password!'
                            );
                            res.redirect(`/auth/reset/${id}`);
                        } else {
                            req.flash(
                                'success_msg',
                                'Password reset successfully!'
                            );
                            res.redirect('/auth/login');
                        }
                    }
                );

            });
        });
    }
}

//------------ Login Handle ------------//
exports.loginHandle = (req, res, next) => {
  
  User.findOne({ email: req.body.email }).then(user => {
    let successRedirect;
      if (user) {
          // Determine the success redirect based on the user's role 
          switch (user.role) {
              case 'Asha':
                  successRedirect = '/asha_login';
                  break;
              case 'Doctor':
                  successRedirect = '/doctor_login';
                  break;
              default:
                  req.flash('error_msg', 'Access restricted!');
                  successRedirect = '/auth/register';
          }
        passport.authenticate('local', {
            successRedirect: successRedirect,
            failureRedirect: '/auth/register',
            failureFlash: true
        })(req, res, next);
        
          // Now you can proceed with your logic based on the user's role
      } else {
        req.flash('error_msg', 'User not found. Please register.');
        res.redirect('/auth/register');
          console.log('User not found');
      }
  }).catch(error => {
      // Error handling if findOne operation fails
      console.error('Error finding user:', error);
      req.flash('error_msg', 'Error finding user. Please try again.');
      res.redirect('/auth/login');
  });

    // Use the determined successRedirect value in passport.authenticate()
    
}


exports.loginUserHandle = (req, res, next) => {
  const { aadhar } = req.body;

  Patient.findOne({ aadhar })
    .then(user => {
      if (user) {
        // If the user is found, redirect to the '/user_result' route and pass the Aadhar number
        res.redirect(`/user_result?aadhar=${aadhar}`);
      } else {
        req.flash("error_msg", "User not found. Please Take a test.")
        res.render('user_login', { aadhar });
      }
    })
    .catch(err => {
      console.error("Error finding user:", err);
      req.flash("error_msg", "An error occurred. Please try again later.");
      res.redirect('/user_login');
    });
};

//------------ Logout Handle ------------//
exports.logoutHandle = (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
}