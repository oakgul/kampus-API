const express = require('express');
const { getAccessToRoute, getAdminAccess }= require('../middlewares/auth');
const { blockUser, deleteUser } = require('../controllers/admin');
const { checkUserExist } = require('../middlewares/databaseErrorHelpers');
 
const router = express.Router();

// Tüm route'larda (admin.js) bu middlewares'lar çalışsın.
router.use([getAccessToRoute, getAdminAccess]);

router.get('/block/:id', checkUserExist, blockUser);
router.delete('/users/:id', checkUserExist, deleteUser);

module.exports = router;