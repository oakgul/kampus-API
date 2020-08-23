const express = require('express');
const { getAccessToRoute, getAnnounceOwnerAccess } = require('../middlewares/auth') ;
const { checkAnnounceExist } = require('../middlewares/databaseErrorHelpers');
const { shareNewAnnounce, getAllAnnounce, getSingleAnnounce, editAnnounce } = require('../controllers/announce');

const router = express.Router();

router.get('/', getAccessToRoute, getAllAnnounce);
router.get('/:id', getAccessToRoute, checkAnnounceExist, getSingleAnnounce);
router.post('/share', getAccessToRoute, shareNewAnnounce);
router.put('/:id/edit', [getAccessToRoute, checkAnnounceExist, getAnnounceOwnerAccess], editAnnounce);

module.exports = router;