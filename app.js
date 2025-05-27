// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Add this line
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth');
const breachRoutes = require('./routes/breaches');
const alertRoutes = require('./routes/alerts');
const userRoutes = require('./routes/users');
const { loadBreachedPasswords, isBreachedPassword } = require('./utils/breachedPasswords');

const app = express();

// Enable CORS for all routes
const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));
app.options("*", cors({
  origin: allowedOrigins,
  credentials: true
}));
console.log("[CORS] Allowed origins:", allowedOrigins);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Add middleware to parse URL-encoded data

// Rate limiting for security
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Limit each IP to 100 requests per window
});
app.use(limiter);

// Swagger setup
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Load breached passwords at server startup
loadBreachedPasswords('./fake_breach_data_v3.csv').then(() => {
  console.log('Breached password CSV loaded.');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/breaches', breachRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/users', userRoutes);

module.exports = app;