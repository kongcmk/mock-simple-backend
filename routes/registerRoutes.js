const express = require('express');
const router = express.Router();
const user = require('../controllers/register.controllers.js');


router.post('/', user.createUser);


module.exports = router;