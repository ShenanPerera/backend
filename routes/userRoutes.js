const express = require('express');
const User = require('../models/userModel');
const {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getUser,
} = require('../controllers/userController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

//create user
router.post('/signup', createUser);

//login user
router.post('/login', loginUser);

//update user

router.put('/updateUser', requireAuth, updateUser);

//delete user
router.delete('/deleteUser', requireAuth, deleteUser);

//get single user
router.get('/getUser', requireAuth, getUser);

//logout user
// router.get('/logout', requireAuth, logout);

module.exports = router;
