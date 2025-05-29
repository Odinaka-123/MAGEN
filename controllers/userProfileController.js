// controllers/userProfileController.js
// Logic for user profile, previously in magen-frontend/app/api/user/profile/route.ts
const { getUserById } = require('../services/database');

async function getProfile(req, res) {
  try {
    const userId = req.user && req.user.id; // Assuming JWT middleware sets req.user
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { getProfile };
