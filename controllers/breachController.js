// controllers/breachController.js (updated scanBreaches)
const { createBreach, getBreachesByUser } = require('../models/Breach');
const { triggerAlert } = require('./alertController');
const { checkBreaches } = require('../services/breachDetectionService');
const { isBreachedPassword, getCsvBreachesForEmail } = require('../utils/breachedPasswords');

const scanBreaches = async (req, res) => {
  try {
    console.log("[scanBreaches] Endpoint hit");
    console.log("[scanBreaches] Request body:", req.body);
    console.log("[scanBreaches] Authenticated user:", req.user);

    const email = req.body.email || req.user.email; // Use provided or user email
    if (!email) {
      console.warn("[scanBreaches] No email provided in request body or user session.");
      return res.status(400).json({ message: 'Email is required for breach scan.' });
    }
    const breaches = await checkBreaches(req.user.userId, email);
    console.log("[scanBreaches] Breaches found:", breaches);

    // Save found breaches to the user's account if not already present
    const userBreaches = await getBreachesByUser(req.user.userId);
    const userBreachSignatures = new Set(userBreaches.map(b => `${b.email || ''}|${b.breach_source || b.source || ''}|${b.breach_timestamp || b.date_detected || ''}`));
    const { createBreachFull } = require('../models/Breach');

    for (const breach of breaches) {
      const sig = `${breach.email || ''}|${breach.breach_source || breach.source || ''}|${breach.breach_timestamp || breach.date_detected || ''}`;
      if (!userBreachSignatures.has(sig)) {
        await createBreachFull({
          user_id: req.user.userId,
          email: breach.email,
          phone: breach.phone,
          password: breach.password,
          breach_status: breach.breach_status || breach.status || 'COMPROMISED',
          breach_source: breach.breach_source || breach.source || 'Unknown',
          breach_timestamp: breach.breach_timestamp || breach.date_detected || new Date(),
          description: breach.description || `Imported from scan for ${email}`
        });
      }
      await triggerAlert(req.user.userId, null, {
        source: breach.breach_source || breach.source,
        date_detected: breach.breach_timestamp || breach.date_detected
      });
    }
    res.status(200).json({ 
      message: breaches.length > 0 
        ? `Scan complete. Found ${breaches.length} breach(es) for ${email}.` 
        : `Scan complete. No breaches found for ${email}.`, 
      breaches, 
      email // include the actual scanned email in the response for debugging
    });
  } catch (error) {
    console.error('[scanBreaches] Error:', error);
    res.status(500).json({ message: 'Error scanning breaches', error: error.message });
  }
};

const getBreaches = async (req, res) => {
  try {
    console.log("Fetching breaches for user ID:", req.user.userId);
    const breaches = await getBreachesByUser(req.user.userId);
    console.log("Database breaches:", breaches);

    const formattedBreaches = breaches.map((breach) => ({
      ...breach,
      status: breach.breach_status || 'New',
      affectedData: [
        'Email',
        ...(breach.password ? ['Password'] : []),
        ...(breach.phone ? ['Phone'] : []),
      ],
    }));

    const csvBreaches = getCsvBreachesForEmail(req.user.email);
    console.log("CSV breaches:", csvBreaches);

    res.status(200).json({ breaches: [...formattedBreaches, ...csvBreaches] });
  } catch (error) {
    res.status(200).json({ breaches: [] });
  }
};

const getBreachStats = async (req, res) => {
  try {
    // Example: show total breached passwords loaded from CSV
    const breachedCount = require('../utils/breachedPasswords').breachedPasswords?.size || 0;
    res.status(200).json({
      breachedPasswordsCount: breachedCount,
      // You can add more stats here, e.g. user breaches, chart data, etc.
    });
  } catch (error) {
    res.status(200).json({ breachedPasswordsCount: 0 });
  }
};

module.exports = { getBreaches, scanBreaches, getBreachStats };