const express = require('express');
const router = express.Router();

// Placeholder route to avoid Express error
router.get('/', (req, res) => {
  res.json({ message: 'User route working' });
});

module.exports = router;