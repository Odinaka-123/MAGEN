// routes/nextAuth.js
// Express route for handling login using the logic from nextAuthController

const express = require('express');
const router = express.Router();
const { loginHandler } = require('../controllers/nextAuthController');

router.post('/login', loginHandler);

module.exports = router;
