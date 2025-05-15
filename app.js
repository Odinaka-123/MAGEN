// app.js
require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth');
const breachRoutes = require('./routes/breaches');
const alertRoutes = require('./routes/alerts');
const userRoutes = require('./routes/users');
require('./config/mongo')();

const app = express();

// Middleware
app.use(express.json());

// Rate limiting for security
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Limit each IP to 100 requests per window
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/breaches', breachRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/users', userRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});