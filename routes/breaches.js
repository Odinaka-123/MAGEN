// routes/breaches.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { getBreaches, scanBreaches, getBreachStats, getBreachById } = require('../controllers/breachController');

/**
 * @swagger
 * /api/breaches/stats:
 *   get:
 *     summary: Get breach statistics
 *     tags: [Breaches]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Breach statistics
 *       401:
 *         description: Unauthorized
 */
router.get('/stats', auth, getBreachStats);

/**
 * @swagger
 * /api/breaches/scan:
 *   post:
 *     summary: Scan for new breaches
 *     tags: [Breaches]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Scan complete
 *       401:
 *         description: Unauthorized
 */
router.post('/scan', auth, scanBreaches);

/**
 * @swagger
 * /api/breaches:
 *   get:
 *     summary: Get all breaches
 *     tags: [Breaches]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of breaches
 *       401:
 *         description: Unauthorized
 */
router.get('/', auth, getBreaches);

/**
 * @swagger
 * /api/breaches/{id}:
 *   get:
 *     summary: Get a single breach by ID
 *     tags: [Breaches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the breach
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Breach details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Breach not found
 */
router.get('/:id', auth, getBreachById);

module.exports = router;