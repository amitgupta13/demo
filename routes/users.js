const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
const validation = require('../validation/validation');
const auth = require('../middleware/auth');

router.post('/signup', validation.userValidation, users.signUp);
router.post('/login', validation.loginValidation, users.login);
router.get('/news', users.googleApi);
router.post('/', validation.loginValidation, users.sendOtp);
router.post('/verifyotp', validation.verifyValidation , users.verifyOtp);
router.post('/profile', auth, users.profile);

module.exports = router;
