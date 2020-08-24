const express = require('express');
const { getAccessToRoute } = require('../middlewares/auth') ;
const { addNewAnswerToAnnounce, getAllAnswersByAnnounce } = require('../controllers/answer');

// answer route'unu announce route'unun içinden çağırdığımız için, req.params içindeki veriler gelmiyor.
// Bunun için {mergeParams:true}
const router = express.Router({mergeParams:true});

router.post('/',getAccessToRoute, addNewAnswerToAnnounce);
router.get('/',getAccessToRoute, getAllAnswersByAnnounce);

module.exports = router;
