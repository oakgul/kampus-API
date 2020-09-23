const express = require('express');
const { getSingleUser, getAllUsers } = require('../controllers/user.js');
const { checkUserExist } = require('../middlewares/databaseErrorHelpers');
const { getAccessToRoute } = require('../middlewares/auth');

const router = express.Router();

router.get('/:id',getAccessToRoute, checkUserExist, getSingleUser);  
router.get('/',getAccessToRoute, getAllUsers);

module.exports = router;