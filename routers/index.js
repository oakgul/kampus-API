const express = require('express');
const auth = require('./auth');
const announce = require('./announce');

const router = express.Router();

router.use('/auth', auth);
router.use('/announce', announce);

module.exports = router;