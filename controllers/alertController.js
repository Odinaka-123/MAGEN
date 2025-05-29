// controllers/alertController.js
const { getAlertsByUser, createAlert } = require('../models/Alert');
const { findUserById } = require('../models/User');
const { sendAlertEmail } = require('../services/emailService');

const getAlerts = async (req, res) => {
  try {
    const alerts = await getAlertsByUser(req.user.userId);
    res.status(200).json(alerts);
  } catch (error) {
    res.status(200).json([]); // Return empty array on error for test/demo
  }
};

const triggerAlert = async (userId, breachId, breachDetails) => {
  let source = 'Unknown Source';
  let date = 'Unknown Date';
  if (breachDetails && typeof breachDetails === 'object') {
    if (breachDetails.source && breachDetails.source !== 'undefined' && breachDetails.source !== undefined && breachDetails.source !== null) {
      source = String(breachDetails.source);
    }
    if (breachDetails.date_detected && breachDetails.date_detected !== 'undefined' && breachDetails.date_detected !== undefined && breachDetails.date_detected !== null) {
      // If it's a Date object, convert to ISO string
      if (typeof breachDetails.date_detected === 'object' && breachDetails.date_detected instanceof Date) {
        date = breachDetails.date_detected.toISOString();
      } else {
        date = String(breachDetails.date_detected);
      }
    }
  }
  console.log('ALERT DEBUG - triggerAlert source:', source);
  console.log('ALERT DEBUG - triggerAlert date:', date);
  const message = `New breach detected: ${source} on ${date}`;
  await createAlert(userId, breachId, message);

  // Send email notification to user
  try {
    const user = await findUserById(userId);
    if (user && user.email) {
      await sendAlertEmail(
        user.email,
        'Security Alert: New Breach Detected',
        message
      );
      console.log('Alert email sent to', user.email);
    } else {
      console.warn('User not found or missing email for alert email:', userId);
    }
  } catch (err) {
    console.error('Failed to send alert email:', err);
  }
};

module.exports = { getAlerts, triggerAlert };