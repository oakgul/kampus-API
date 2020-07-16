const express = require('express');
const { getAllAnnounces } = require('../controllers/announce');

const router = express.Router();

router.get('/', getAllAnnounces);

module.exports = router;