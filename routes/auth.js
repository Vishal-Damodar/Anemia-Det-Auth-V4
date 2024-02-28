const express = require('express');
const router = express.Router();

//------------ Importing Controllers ------------//
const authController = require('../controllers/authController')

//------------ Login Route ------------//
router.get('/login', (req, res) => res.render('login'));
//------------ Login POST Handle ------------//
router.post('/login', authController.loginHandle);

router.get('/user_login', (req, res) => res.render('user_login'));
router.post('/user_login', authController.loginUserHandle);

//------------ Forgot Password Route ------------//
router.get('/forgot', (req, res) => res.render('forgot'));
//------------ Forgot Password Handle ------------//
router.post('/forgot', authController.forgotPassword);

//------------ Reset Password Route ------------//
router.get('/reset/:id', (req, res) => {
    // console.log(id)
    res.render('reset', { id: req.params.id })
});
//------------ Reset Password Handle ------------//
router.post('/reset/:id', authController.resetPassword);

//------------ Register Route ------------//
router.get('/register', (req, res) => res.render('register'));
//------------ Register POST Handle ------------//
router.post('/register', authController.registerHandle);

//------------ Email ACTIVATE Handle ------------//
router.get('/activate/:token', authController.activateHandle);

//------------ Reset Password Handle ------------//
router.get('/forgot/:token', authController.gotoReset);

//------------ Logout GET Handle ------------//
router.get('/logout', authController.logoutHandle);

module.exports = router;