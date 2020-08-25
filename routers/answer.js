const express = require('express');
const { getAccessToRoute } = require('../middlewares/auth') ;
const { addNewAnswerToAnnounce, getAllAnswersByAnnounce, getSingleAnswer } = require('../controllers/answer');
const { checkAnnounceAndAnswerExist } = require('../middlewares/databaseErrorHelpers');

// answer route'unu announce route'unun içinden çağırdığımız için, req.params içindeki veriler gelmiyor.
// Bunun için {mergeParams:true}
const router = express.Router({mergeParams:true});

router.post('/',getAccessToRoute, addNewAnswerToAnnounce);
router.get('/',getAccessToRoute, getAllAnswersByAnnounce);
router.get('/:answer_id',getAccessToRoute, checkAnnounceAndAnswerExist, getSingleAnswer);

module.exports = router;
