// services/breachDetectionService.js
const fetch = require('node-fetch');
const { createBreach } = require('../models/Breach');

const checkBreaches = async (userId, email) => {
  try {
    const response = await fetch(`https://haveibeenpwned.com/api/v3/breachedaccount/${email}`, {
      headers: {
        'hibp-api-key': process.env.HIBP_API_KEY, // Add this to .env if using paid API
        'user-agent': 'MAGEN-App'
      }
    });
    if (!response.ok) return [];

    const breaches = await response.json();
    for (const breach of breaches) {
      await createBreach(userId, breach.Name, breach.BreachDate, breach.Description);
    }
    return breaches;
  } catch (error) {
    console.error('Error checking breaches:', error);
    return [];
  }
};

module.exports = { checkBreaches };