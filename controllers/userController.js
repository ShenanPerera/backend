const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '1d' });
};

//create user
const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    await User.signup(name, email, password);
    res.status(201).json({ name, email });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    //create a token
    const token = createToken(user._id);
    const { name } = user;
    res.status(201).json({ name, email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//update user

const updateUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  const userId = req.id;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Please fill all the fields' });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email' });
  }

  if (!validator.isStrongPassword(password)) {
    return res.status(400).json({
      error:
        'Password must be at least 8 characters long and contain at least 1 lowercase, 1 uppercase, 1 number, and 1 symbol',
    });
  }

  // Authenticate the user
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Check if the new name or password are different from the current name or password
  if (name === user.name && password === user.password) {
    return res.status(400).json({ error: 'No changes detected' });
  }

  try {
    // Update the user
    user.name = name;
    user.email = email;
    user.password = password;
    await user.save();

    res.status(200).json({ name, email, password });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//delete user
const deleteUser = async (req, res, next) => {
  const id = req.id;
  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//get single user
const getUser = async (req, res, next) => {
  const id = req.id;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const name = user.name;
    const email = user.email;

    res.status(200).json({ name, email });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//logout user
// const logout = async (req, res, next) => {
//   // Delete the JWT token
//   res.clearCookie('token');
//   res.status(200).json({ message: 'User logged out successfully' });
// };

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getUser,
  //   logout,
};
