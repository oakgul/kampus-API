const express = require('express');
const { getAccessToRoute } = require('../middlewares/auth') 
const { shareNewAnnounce, getAllAnnounce } = require('../controllers/announce');

const router = express.Router();

router.get('/', getAccessToRoute, getAllAnnounce);
router.post('/share', getAccessToRoute, shareNewAnnounce);

module.exports = router;