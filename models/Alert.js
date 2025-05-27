// models/Alert.js
const pool = require('../config/db');

// Create a new alert
async function createAlert(userId, breachId, message) {
  const [result] = await pool.execute(
    'INSERT INTO alerts (user_id, breach_id, message) VALUES (?, ?, ?)',
    [userId, breachId, message]
  );
  return result.insertId;
}

// Get alerts by user
async function getAlertsByUser(userId) {
  const [rows] = await pool.execute('SELECT * FROM alerts WHERE user_id = ? ORDER BY created_at DESC', [userId]);
  return rows;
}

module.exports = {
  createAlert,
  getAlertsByUser,
};