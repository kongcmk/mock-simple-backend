const express = require('express');
const router = express.Router();
const user = require('../controllers/login.controllers.js');
// const passport = require('passport')

router.post('/', user.login);


module.exports = router;