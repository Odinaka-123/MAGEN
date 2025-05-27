// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../models/User');
const { isBreachedPassword } = require('../utils/breachedPasswords');

const register = async (req, res) => {
  console.log("Incoming request to /api/auth/register"); // Log route hit
  console.log("Request body:", req.body); // Debugging line to log the request body
  console.log("Request headers:", req.headers); // Debugging line to log request headers

  if (!req.body) {
    console.error("Request body is missing"); // Log error
    return res.status(400).json({ message: 'Request body is missing' });
  }

  const { name, email, password } = req.body;
  console.log("Parsed request body:", { name, email, password }); // Log parsed body

  // Check if password is breached
  if (isBreachedPassword(password)) {
    console.warn("Attempted registration with breached password");
    return res.status(400).json({ message: 'This password has been found in a breach. Please choose another.' });
  }

  try {
    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      console.warn("User already exists with email:", email); // Log warning
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully"); // Log success

    const userId = await createUser(name, email, hashedPassword);
    console.log("User created with ID:", userId); // Log user creation

    res.status(201).json({ message: 'User registered', userId });
  } catch (error) {
    console.error("Error during registration:", error.message); // Log error
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Attach email to JWT payload for future requests
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

module.exports = { register, login };