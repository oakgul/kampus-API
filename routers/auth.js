const express = require('express');
const { register, login, logout, getUser } = require('../controllers/auth');
const { getAccessToRoute } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', getAccessToRoute, getUser);
router.get('/logout', getAccessToRoute, logout);

module.exports = router;