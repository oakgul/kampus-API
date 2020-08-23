const express = require('express');
const { getSingleUser, getAllUsers } = require('../controllers/user.js');
const { checkUserExist } = require('../middlewares/databaseErrorHelpers');

const router = express.Router();

router.get('/:id', checkUserExist, getSingleUser);
router.get('/', getAllUsers);

module.exports = router;