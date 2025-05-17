// controllers/breachController.js (updated scanBreaches)
const { createBreach, getBreachesByUser } = require('../models/Breach');
const { triggerAlert } = require('./alertController');
const { checkBreaches } = require('../services/breachDetectionService');

const scanBreaches = async (req, res) => {
  try {
    const email = req.body.email || req.user.email; // Use provided or user email
    if (!email) {
      return res.status(400).json({ message: 'Email is required for breach scan.' });
    }
    const breaches = await checkBreaches(req.user.userId, email);
    // Optionally trigger alerts for new breaches
    for (const breach of breaches) {
      await triggerAlert(req.user.userId, null, {
        source: breach.Name,
        date_detected: breach.BreachDate
      });
    }
    res.status(200).json({ message: 'Scan complete', breaches });
  } catch (error) {
    res.status(500).json({ message: 'Error scanning breaches', error: error.message });
  }
};

const getBreaches = async (req, res) => {
  try {
    const breaches = await getBreachesByUser(req.user.userId);
    res.status(200).json({ breaches });
  } catch (error) {
    res.status(200).json({ breaches: [] });
  }
};

const getBreachStats = async (req, res) => {
  try {
    // Return empty stats for now
    res.status(200).json({ dates: [], breachCounts: [] });
  } catch (error) {
    res.status(200).json({ dates: [], breachCounts: [] });
  }
};

module.exports = { getBreaches, scanBreaches, getBreachStats };