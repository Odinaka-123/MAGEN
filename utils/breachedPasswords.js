const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

// Store breached passwords in a Set for fast lookup
let breachedPasswords = new Set();
let breachedRows = [];
let isLoaded = false;

function loadBreachedPasswords(filePath) {
  return new Promise((resolve, reject) => {
    const absPath = path.resolve(filePath);
    fs.createReadStream(absPath)
      .pipe(csv())
      .on('data', (row) => {
        // Add password to set for fast lookup
        if (row.password) {
          breachedPasswords.add(row.password);
        }
        // Store the whole row for email-based lookups
        breachedRows.push(row);
      })
      .on('end', () => {
        isLoaded = true;
        console.log('Breached passwords loaded:', breachedPasswords.size);
        resolve();
      })
      .on('error', reject);
  });
}

function isBreachedPassword(password) {
  if (!isLoaded) return false; // Not loaded yet
  return breachedPasswords.has(password);
}

// Get breaches for a user from the CSV
function getCsvBreachesForEmail(email) {
  if (!isLoaded) return [];
  const emailLower = email.toLowerCase();
  // Find all rows where the email matches and breach_status is COMPROMISED
  return breachedRows
    .filter((row) => row.email && row.email.toLowerCase() === emailLower && row.breach_status === 'COMPROMISED')
    .map((row, idx) => ({
      id: `csv-${row.id || idx}`,
      source: row.breach_source || 'CSV Breach',
      date: row.breach_timestamp || '',
      description: `Breached info found in CSV: ${row.breach_source || 'Unknown source'}`,
      status: 'New',
      affectedData: ['Email', ...(row.password ? ['Password'] : []), ...(row.phone ? ['Phone'] : [])],
    }));
}

// Export breachedPasswords set for stats
module.exports = {
  loadBreachedPasswords,
  isBreachedPassword,
  breachedPasswords,
  getCsvBreachesForEmail,
};
