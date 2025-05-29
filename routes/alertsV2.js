// routes/alertsV2.js
// Express route for alerts
const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middlewares/auth');
const { getAlerts } = require('../controllers/alertsControllerV2');

router.get('/', authenticateJWT, getAlerts);

module.exports = router;
