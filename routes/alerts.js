// routes/alerts.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { getAlerts } = require('../controllers/alertController');

router.get('/', auth, getAlerts);

module.exports = router;