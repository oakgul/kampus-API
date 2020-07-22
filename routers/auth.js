const express = require('express');
const { register } = require('../controllers/auth');
const { getAccessToRoute } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', register);

module.exports = router;