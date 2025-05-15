// controllers/alertController.js
const { getAlertsByUser, createAlert } = require('../models/Alert');
const { sendAlertEmail } = require('../services/emailService');
const pool = require('../config/db');

const getAlerts = async (req, res) => {
  try {
    const alerts = await getAlertsByUser(req.user.userId);
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching alerts', error: error.message });
  }
};

const triggerAlert = async (userId, breachId, breachDetails) => {
  const message = `New breach detected: ${breachDetails.source} on ${breachDetails.date_detected}`;
  await createAlert(userId, breachId, message);

  const [users] = await pool.execute('SELECT email FROM users WHERE id = ?', [userId]);
  const user = users[0];
  await sendAlertEmail(user.email, 'MAGEN Alert: New Breach Detected', message);
};

module.exports = { getAlerts, triggerAlert };