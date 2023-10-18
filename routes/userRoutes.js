const express = require('express');
const router = express.Router();
const user = require('../controllers/user.controllers')
const auth = require('../middleware/authMiddleware')

router.get('/', auth , user.getUsers);
router.get('/view', auth , user.getUser);
router.put('/update', auth , user.editUser)
module.exports = router