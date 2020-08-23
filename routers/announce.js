const express = require('express');
const { getAccessToRoute } = require('../middlewares/auth') 
const { shareNewAnnounce } = require('../controllers/announce');

const router = express.Router();

router.post('/share', getAccessToRoute, shareNewAnnounce);

module.exports = router;