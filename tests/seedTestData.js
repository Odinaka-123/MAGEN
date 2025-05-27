const pool = require('../config/db');

module.exports = async () => {
  await pool.execute('DELETE FROM breaches');
  await pool.execute('DELETE FROM alerts');
  await pool.execute('DELETE FROM users');
};
