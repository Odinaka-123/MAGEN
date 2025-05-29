// models/Breach.js
const pool = require('../config/db');

// Create a new breach
async function createBreach(email, source, dateDetected, description) {
  const [result] = await pool.execute(
    'INSERT INTO breaches (email, breach_source, breach_timestamp, description) VALUES (?, ?, ?, ?)',
    [email, source, dateDetected, description]
  );
  return result.insertId;
}

// Get breaches by user (by email)
async function getBreachesByUser(email) {
  console.log("Executing query: SELECT * FROM breaches WHERE email = ?");
  console.log("With parameters:", [email]);

  const [rows] = await pool.execute('SELECT * FROM breaches WHERE email = ? ORDER BY breach_timestamp DESC', [email]);
  return rows;
}

// Create a new breach with all relevant fields
async function createBreachFull(breach) {
  const [result] = await pool.execute(
    'INSERT INTO breaches (email, phone, password, breach_status, breach_source, breach_timestamp, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [
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