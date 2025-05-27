const pool = require('../config/db');

// Create a new user
async function createUser(name, email, passwordHash) {
  const [result] = await pool.execute(
    'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
    [name, email, passwordHash]
  );
  return result.insertId;
}

// Find user by email
async function findUserByEmail(email) {
  const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
}

// Find user by ID
async function findUserById(id) {
  const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0] || null;
}

// Update user by ID
async function updateUserById(id, name, email) {
  const [result] = await pool.execute(
    'UPDATE users SET name = ?, email = ? WHERE id = ?',
    [name, email, id]
  );
  return result.affectedRows;
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserById,
};
