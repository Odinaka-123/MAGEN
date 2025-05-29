// controllers/breachControllerV2.js
// Logic for breaches, previously in magen-frontend/app/api/breaches/route.ts and related files
const { getBreachesByUserId, scanBreachesForEmail, getBreachStats, getBreachById } = require('../services/database');

async function getBreaches(req, res) {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const breaches = await getBreachesByUserId(userId);
    return res.json(breaches);
  } catch (error) {
    console.error('Error fetching breaches:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function scanBreaches(req, res) {
  try {
    const userId = req.user && req.user.id;
    const { email } = req.body;
    if (!userId || !email) return res.status(400).json({ error: 'User and email required' });
    const result = await scanBreachesForEmail(userId, email);
    return res.json({ message: 'Scan complete', breaches: result });
  } catch (error) {
    console.error('Error scanning breaches:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getStats(req, res) {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const stats = await getBreachStats(userId);
    return res.json(stats);
  } catch (error) {
    console.error('Error fetching breach stats:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getBreachByIdHandler(req, res) {
  try {
    const userId = req.user && req.user.id;
    const { id } = req.params;
    if (!userId || !id) return res.status(400).json({ error: 'User and breach id required' });
    const breach = await getBreachById(userId, id);
    if (!breach) return res.status(404).json({ error: 'Breach not found' });
    return res.json(breach);
  } catch (error) {
    console.error('Error fetching breach by id:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { getBreaches, scanBreaches, getStats, getBreachByIdHandler };
