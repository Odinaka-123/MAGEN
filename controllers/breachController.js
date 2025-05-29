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
    const userBreaches = await getBreachesByUser(req.user.email);
    const userBreachSignatures = new Set(userBreaches.map(b => `${b.email || ''}|${b.breach_source || b.source || ''}|${b.breach_timestamp || b.date_detected || ''}`));
    const { createBreachFull } = require('../models/Breach');

    for (const breach of breaches) {
      const sig = `${breach.email || ''}|${breach.breach_source || breach.source || ''}|${breach.breach_timestamp || breach.date_detected || ''}`;
      if (!userBreachSignatures.has(sig)) {
        await createBreachFull({
          email: breach.email,
          phone: breach.phone,
          password: breach.password,
          breach_status: breach.breach_status || breach.status || 'COMPROMISED',
          breach_source: breach.breach_source || breach.source || 'Unknown',
          breach_timestamp: breach.breach_timestamp || breach.date_detected || new Date(),
          description: breach.description || `Imported from scan for ${email}`
        });
      }
      // DEBUG: Log breach object for troubleshooting
      console.log('ALERT DEBUG - breach object:', JSON.stringify(breach));
      // DEBUG: Log source and date_detected extraction
      const alertSource = breach.breach_source || breach.source || 'Unknown Source';
      const alertDate = (breach.breach_timestamp ? new Date(breach.breach_timestamp).toISOString() : (breach.date_detected || 'Unknown Date'));
      console.log('ALERT DEBUG - extracted source:', alertSource);
      console.log('ALERT DEBUG - extracted date:', alertDate);
      await triggerAlert(req.user.userId, null, {
        source: alertSource,
        date_detected: alertDate
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
    console.log("[getBreaches] User email:", req.user.email);
    const breaches = await getBreachesByUser(req.user.email);
    console.log("[getBreaches] Database breaches:", breaches);

    const formattedBreaches = breaches.map((breach) => ({
      ...breach,
      status: breach.breach_status || 'New',
      affectedData: [
        'Email',
        ...(breach.password ? ['Password'] : []),
        ...(breach.phone ? ['Phone'] : []),
      ],
    }));

    const csvBreaches = await getCsvBreachesForEmail(req.user.email);
    console.log("[getBreaches] CSV breaches for email", req.user.email, ":", csvBreaches);
    console.log("[getBreaches] Final breaches to return:", [...formattedBreaches, ...csvBreaches]);

    res.status(200).json({ breaches: [...formattedBreaches, ...csvBreaches] });
  } catch (error) {
    console.error('[getBreaches] Error:', error);
    res.status(500).json({ breaches: [], error: error.message });
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

// Get a single breach by ID (DB or CSV)
const getBreachById = async (req, res) => {
  const { id } = req.params;
  try {
    console.log('[getBreachById] Requested id:', id);
    // Try to find in DB
    const db = require('../config/db');
    const [rows] = await db.execute('SELECT * FROM breaches WHERE id = ?', [id]);
    console.log('[getBreachById] DB query result:', rows);
    if (rows && rows.length > 0) {
      const breach = rows[0];
      // Format like in getBreaches
      breach.status = breach.breach_status || 'New';
      breach.affectedData = [
        'Email',
        ...(breach.password ? ['Password'] : []),
        ...(breach.phone ? ['Phone'] : []),
      ];
      return res.status(200).json(breach);
    }
    // Try to find in CSV (search ALL CSV breaches, not just for user)
    const { getAllCsvBreaches } = require('../utils/breachedPasswords');
    let allCsvBreaches = [];
    if (typeof getAllCsvBreaches === 'function') {
      allCsvBreaches = await getAllCsvBreaches();
    } else {
      // fallback: try getCsvBreachesForEmail for all emails (legacy)
      const { getCsvBreachesForEmail } = require('../utils/breachedPasswords');
      allCsvBreaches = await getCsvBreachesForEmail('*'); // '*' or similar to get all, if supported
    }
    console.log('[getBreachById] All CSV breach IDs:', allCsvBreaches.map(b => b.id));
    const csvBreach = allCsvBreaches.find(b => String(b.id) === String(id));
    if (csvBreach) {
      return res.status(200).json(csvBreach);
    }
    return res.status(404).json({ message: 'Breach Not Found' });
  } catch (error) {
    console.error('[getBreachById] Error:', error);
    return res.status(500).json({ message: 'Error fetching breach', error: error.message });
  }
};

module.exports = { getBreaches, scanBreaches, getBreachStats, getBreachById };