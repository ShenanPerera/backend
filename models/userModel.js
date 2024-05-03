const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const schema = mongoose.Schema;

const userSchema = new schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// static method to signup user
userSchema.statics.signup = async function (name, email, password) {
  if (!name || !email || !password) {
    throw Error('Please fill all the fields');
  }

  if (!validator.isEmail(email)) {
    throw Error('Please enter a valid email');
  }

  if (!validator.isStrongPassword(password)) {
    throw Error(
      'Password must be at least 8 characters long and contain at least 1 lowercase, 1 uppercase, 1 number, and 1 symbol'
    );
  }

  const emailExist = await this.findOne({
    email: email,
  });

  if (emailExist) {
    throw Error('Email already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    name,
    email,
    password: hash,
  });

  return user;
};

// static method to login user
userSchema.statics.login = async function (email, password) {
  //validation
  if (!email || !password) {
    throw Error('All fields must be filled');
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw Error('Incorrect email');
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error('Incorrect password');
  }

  return user;
};

module.exports = mongoose.model('User', userSchema);
