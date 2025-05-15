// controllers/breachController.js (updated scanBreaches)
const { triggerAlert } = require('./alertController');
const pool = require('../config/db');
const { checkBreaches } = require('../services/breachDetectionService');

const scanBreaches = async (req, res) => {
  const { email } = req.body;
  try {
    const breaches = await checkBreaches(req.user.userId, email);
    for (const breach of breaches) {
      const [breachRows] = await pool.execute(
        'SELECT id FROM breaches WHERE user_id = ? AND source = ?',
        [req.user.userId, breach.Name]
      );
      const breachId = breachRows[0].id;
      await triggerAlert(req.user.userId, breachId, {
        source: breach.Name,
        date_detected: breach.BreachDate
      });
    }
    res.json({ message: 'Scan complete', breaches });
  } catch (error) {
    res.status(500).json({ message: 'Error scanning breaches', error: error.message });
  }
};

const getBreaches = async (req, res) => {
  try {
    const [breaches] = await pool.execute(
      'SELECT * FROM breaches WHERE user_id = ?',
      [req.user.userId]
    );
    res.json({ breaches });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching breaches', error: error.message });
  }
};

// controllers/breachController.js
const getBreachStats = async (req, res) => {
  try {
    const [stats] = await pool.execute(
      'SELECT DATE(date_detected) as date, COUNT(*) as count FROM breaches WHERE user_id = ? GROUP BY DATE(date_detected)',
      [req.user.userId]
    );
    const dates = stats.map(row => row.date);
    const breachCounts = stats.map(row => row.count);
    res.json({ dates, breachCounts });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching breach stats', error: error.message });
  }
};

module.exports = { getBreaches, scanBreaches, getBreachStats };