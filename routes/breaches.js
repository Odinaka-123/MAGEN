// routes/breaches.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { getBreaches, scanBreaches, getBreachStats } = require('../controllers/breachController');

router.get('/stats', auth, getBreachStats);

router.post('/scan', auth, scanBreaches);

router.get('/', auth, getBreaches);

module.exports = router;