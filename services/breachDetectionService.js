// services/breachDetectionService.js
const pool = require('../config/db');

// Check for breaches by email in the local database
const checkBreaches = async (userId, email) => {
  try {
    const cleanEmail = email.trim().toLowerCase();
    console.log('Checking breaches for email:', cleanEmail);

    const query = 'SELECT * FROM breaches WHERE LOWER(email) = ?';
    const params = [cleanEmail];

    console.log('Executing query:', query);
    console.log('With parameters:', params);

    const [rows] = await pool.execute(query, params);
    console.log('Breaches found:', rows);
    return rows;
  } catch (error) {
    console.error('Error checking breaches:', error);
    return [];
  }
};

module.exports = { checkBreaches };