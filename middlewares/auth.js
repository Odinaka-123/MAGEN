// middlewares/auth.js
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("[AUTH MIDDLEWARE] Authorization header:", authHeader); // Log the header
  const token = authHeader?.split(' ')[1];
  if (!token) {
    console.warn("[AUTH MIDDLEWARE] No token provided");
    return res.status(401).json({ message: 'Unauthorized', debug: { authHeader } });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // If the token does not have email, fetch it from DB and attach
    if (!decoded.email) {
      // Lazy-load User model to avoid circular dependency
      const { findUserById } = require('../models/User');
      findUserById(decoded.userId).then(user => {
        req.user = { ...decoded, email: user?.email };
        console.log("[AUTH MIDDLEWARE] Token valid, user (patched):", req.user);
        return next();
      }).catch(err => {
        console.error("[AUTH MIDDLEWARE] Could not fetch user email:", err);
        return res.status(401).json({ message: 'Invalid token, could not fetch user email' });
      });
      return;
    }
    req.user = decoded;
    console.log("[AUTH MIDDLEWARE] Token valid, user:", decoded); // Log decoded user
    next();
  } catch (error) {
    console.error("[AUTH MIDDLEWARE] Invalid token:", error.message);
    res.status(401).json({ message: 'Invalid token', debug: { error: error.message, token } });
  }
};

module.exports = auth;