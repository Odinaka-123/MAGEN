// controllers/alertsControllerV2.js
// Logic for alerts, previously in magen-frontend/app/api/alerts/route.ts
const { getAlertsByUserId } = require('../services/database');

async function getAlerts(req, res) {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const alerts = await getAlertsByUserId(userId);
    return res.json(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { getAlerts };
