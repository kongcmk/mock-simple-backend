const express = require('express');
const router = express.Router();
const user = require('../controllers/user.controllers')

router.get('/', user.getUsers);

module.exports = router