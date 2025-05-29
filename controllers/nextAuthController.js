// controllers/nextAuthController.js
// This file contains the logic previously in magen-frontend/app/api/auth/[...nextauth]/route.ts
// It should be used in your Express backend, not in the frontend.

const bcrypt = require('bcrypt');
const { getUserByEmail } = require('../services/database');

// Example login handler for Express
async function loginHandler(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    // Return user info (or JWT, depending on your auth flow)
    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

module.exports = { loginHandler };
