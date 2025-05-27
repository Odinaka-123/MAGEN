// models/Breach.js
const pool = require('../config/db');

// Create a new breach
async function createBreach(userId, source, dateDetected, description) {
  const [result] = await pool.execute(
    'INSERT INTO breaches (user_id, source, date_detected, description) VALUES (?, ?, ?, ?)',
    [userId, source, dateDetected, description]
  );
  return result.insertId;
}

// Get breaches by user
async function getBreachesByUser(userId) {
  console.log("Executing query: SELECT * FROM breaches WHERE user_id = ?");
  console.log("With parameters:", [userId]);

  const [rows] = await pool.execute('SELECT * FROM breaches WHERE user_id = ? ORDER BY breach_timestamp DESC', [userId]);
  return rows;
}

// Create a new breach with all relevant fields
async function createBreachFull(breach) {
  const [result] = await pool.execute(
    'INSERT INTO breaches (user_id, email, phone, password, breach_status, breach_source, breach_timestamp, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [
      breach.user_id,
      breach.email,
      breach.phone,
      breach.password,
      breach.breach_status,
      breach.breach_source,
      breach.breach_timestamp,
      breach.description || null
    ]
  );
  return result.insertId;
}

module.exports = {
  createBreach,
  getBreachesByUser,
  createBreachFull,
};