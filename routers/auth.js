const express = require('express');
const { register, 
        login, 
        logout, 
        getUser, 
        imageUpload, 
        forgotPassword, 
        resetPassword, 
        editDetails } = require('../controllers/auth');
const { getAccessToRoute } = require('../middlewares/auth');
const profileImageUpload = require('../middlewares/profielImageUpload');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', getAccessToRoute, logout);
router.get('/profile', getAccessToRoute, getUser);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword', resetPassword);
router.post('/upload', [getAccessToRoute, profileImageUpload.single('profile_image')], imageUpload);
router.put('/edit', getAccessToRoute, editDetails);

module.exports = router;