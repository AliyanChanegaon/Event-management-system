const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/', authController.getAllUsers);
router.put('/resetpassword', authController.resetPassword);
router.get('/logout',authController.logout)
module.exports = router;
