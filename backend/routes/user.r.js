const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.c');
const fetchUser = require('../middleware/fetch-user')

router.post('/login', userController.login);

router.post('/signup', userController.signUp);

router.post('/update', fetchUser, userController.update);

module.exports = router;