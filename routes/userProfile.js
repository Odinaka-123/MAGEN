// routes/userProfile.js
// Express route for user profile
const express = require('express');
const router = express.Router();
const { getProfile } = require('../controllers/userProfileController');
const { authenticateJWT } = require('../middlewares/auth');

router.get('/profile', authenticateJWT, getProfile);

module.exports = router;
