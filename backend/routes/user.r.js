const express = require('express');
const router = express.Router();

const {Login,SignUp} = require('../controllers/user.c');

router.post('/login',Login);
router.post('/signup',SignUp);

module.exports = router;