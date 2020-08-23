const express = require('express');
const { register, login, logout, getUser, imageUpload, forgotPassword, resetPassword } = require('../controllers/auth');
const { getAccessToRoute } = require('../middlewares/auth');
const profileImageUpload = require('../middlewares/profielImageUpload');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword', resetPassword);
router.get('/profile', getAccessToRoute, getUser);
router.get('/logout', getAccessToRoute, logout);
router.post('/upload', [getAccessToRoute, profileImageUpload.single('profile_image')], imageUpload);

module.exports = router;