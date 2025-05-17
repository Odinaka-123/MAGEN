// routes/alerts.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { getAlerts } = require('../controllers/alertController');

/**
 * @swagger
 * /api/alerts:
 *   get:
 *     summary: Get all alerts
 *     tags: [Alerts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of alerts
 *       401:
 *         description: Unauthorized
 */
router.get('/', auth, getAlerts);

module.exports = router;