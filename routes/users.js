const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { getProfile } = require('../controllers/userController');

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get user route status
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User route working
 */
router.get('/', (req, res) => {
  res.json({ message: 'User route working' });
});

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get current user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/profile', auth, getProfile);

module.exports = router;