// routes/breachesV2.js
// Express routes for breaches
const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middlewares/auth');
const { getBreaches, scanBreaches, getStats, getBreachByIdHandler } = require('../controllers/breachControllerV2');

router.get('/', authenticateJWT, getBreaches);
router.post('/scan', authenticateJWT, scanBreaches);
router.get('/stats', authenticateJWT, getStats);
router.get('/:id', authenticateJWT, getBreachByIdHandler);

module.exports = router;
