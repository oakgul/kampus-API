const express = require('express');
const answer = require('./answer');
const { getAccessToRoute, getAnnounceOwnerAccess } = require('../middlewares/auth') ;
const { checkAnnounceExist } = require('../middlewares/databaseErrorHelpers');
const { shareNewAnnounce, getAllAnnounce, getSingleAnnounce, editAnnounce, deleteAnnounce } = require('../controllers/announce');

const router = express.Router();

router.get('/', getAccessToRoute,  getAllAnnounce);
router.get('/:id', getAccessToRoute, checkAnnounceExist, getSingleAnnounce);
router.post('/share', getAccessToRoute, shareNewAnnounce);
router.put('/:id', [getAccessToRoute, checkAnnounceExist, getAnnounceOwnerAccess], editAnnounce);
router.delete('/:id', [getAccessToRoute, checkAnnounceExist, getAnnounceOwnerAccess], deleteAnnounce);
router.use('/:announce_id/answer', checkAnnounceExist, answer);

module.exports = router;