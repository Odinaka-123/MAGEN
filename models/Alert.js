// models/Alert.js
const pool = require('../config/db');

const createAlert = async (userId, breachId, message) => {
  const [result] = await pool.execute(
    'INSERT INTO alerts (user_id, breach_id, message, status) VALUES (?, ?, ?, ?)',
    [userId, breachId, message, 'Pending']
  );
  return result.insertId;
};

const getAlertsByUser = async (userId) => {
  const [rows] = await pool.execute('SELECT * FROM alerts WHERE user_id = ?', [userId]);
  return rows;
};

module.exports = { createAlert, getAlertsByUser };