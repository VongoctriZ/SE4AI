const express = require('express');
const router = express.Router();

const { Login, SignUp, Update } = require('../controllers/user.c');
const fetchUser = require('../middleware/fetch-user')
router.post('/login', Login);
router.post('/signup', SignUp);
router.post('/update', fetchUser, Update);
module.exports = router;