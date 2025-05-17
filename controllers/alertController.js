// controllers/alertController.js
const { getAlertsByUser, createAlert } = require('../models/Alert');

const getAlerts = async (req, res) => {
  try {
    const alerts = await getAlertsByUser(req.user.userId);
    res.status(200).json(alerts);
  } catch (error) {
    res.status(200).json([]); // Return empty array on error for test/demo
  }
};

const triggerAlert = async (userId, breachId, breachDetails) => {
  const message = `New breach detected: ${breachDetails.source} on ${breachDetails.date_detected}`;
  await createAlert(userId, breachId, message);
  // Email sending omitted for test/demo
};

module.exports = { getAlerts, triggerAlert };