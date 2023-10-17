const express = require('express');
const router = express.Router();
const user = require('../controllers/login.controllers.js');

router.post('/', user.login);


module.exports = router;