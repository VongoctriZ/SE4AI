const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.c');
const fetchUser = require('../middleware/fetch-user')

router.post('/login', userController.login);

router.post('/signup', userController.signUp);

router.post('/update', fetchUser, userController.update);

router.get('/allusers', userController.allUsers);

router.post('/removeuser', userController.removeUser);

router.post('/removeallusers', userController.removeAllUsers);

router.get('/export', userController.exportAttr);

module.exports = router;