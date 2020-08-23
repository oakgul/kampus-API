const express = require('express');
const auth = require('./auth');
const announce = require('./announce');
const user = require('./user');
const admin = require('./admin');

const router = express.Router();

router.use('/auth', auth);
router.use('/users', user);
router.use('/announce', announce);
router.use('/admin', admin);

module.exports = router;