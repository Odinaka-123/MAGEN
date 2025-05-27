const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { getProfile, updateProfile } = require('../controllers/userController');

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
 *   put:
 *     summary: Update current user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

module.exports = router;