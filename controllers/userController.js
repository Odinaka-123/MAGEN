const { findUserById, updateUserById, updateUserByIdWithPassword } = require('../models/User');
const db = require('../config/db');

// Get current user's profile
const getProfile = async (req, res) => {
  try {
    const user = await findUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Exclude password_hash from response
    const { password_hash, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
};

// Update current user's profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, email, password } = req.body;
    let affectedRows;
    if (password) {
      affectedRows = await updateUserByIdWithPassword(userId, name, email, password);
    } else {
      affectedRows = await updateUserById(userId, name, email);
    }
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'Profile updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

module.exports = { getProfile, updateProfile };
