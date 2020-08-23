const express = require('express');
const { getAccessToRoute } = require('../middlewares/auth') ;
const { checkAnnounceExist } = require('../middlewares/databaseErrorHelpers');
const { shareNewAnnounce, getAllAnnounce, getSingleAnnounce } = require('../controllers/announce');

const router = express.Router();

router.get('/', getAccessToRoute, getAllAnnounce);
router.get('/:id', getAccessToRoute, checkAnnounceExist, getSingleAnnounce);
router.post('/share', getAccessToRoute, shareNewAnnounce);

module.exports = router;