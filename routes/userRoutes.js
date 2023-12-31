const express = require('express');
const router = express.Router();
const user = require('../controllers/user.controllers')
const auth = require('../middleware/authMiddleware')

router.get('/', auth , user.getUsers);
router.get('/view', auth , user.getUser);
router.put('/update', auth , user.editUser)
router.put('/update/password', auth, user.editPassword);
router.put('/deactivate', auth, user.deactivatedUser)
module.exports = router