// Database configuration for MAGEN application
// This file provides functions to connect to a MySQL database

import mysql from "mysql2/promise"

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "magen_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

// Create a connection pool
const pool = mysql.createPool(dbConfig)

// Test the database connection
export async function testConnection() {
  try {
    const connection = await pool.getConnection()
    console.log("Database connection successful")
    connection.release()
    return true
  } catch (error) {
    console.error("Database connection failed:", error)
    return false
  }
}

// Execute a query
export async function query(sql: string, params: any[] = []) {
  try {
    const [results] = await pool.execute(sql, params)
    return results
  } catch (error) {
    console.error("Query execution failed:", error)
    throw error
  }
}

// User-related queries
export async function getUserByEmail(email: string) {
  const sql = "SELECT * FROM users WHERE email = ?"
  const results = (await query(sql, [email])) as any[]
  return results.length ? results[0] : null
}

export async function createUser(name: string, email: string, passwordHash: string) {
  const sql = "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)"
  return query(sql, [name, email, passwordHash])
}

// Breach-related queries
export async function getBreachesByUserId(userId: number) {
  const sql = "SELECT * FROM breaches WHERE user_id = ? ORDER BY detected_date DESC"
  return query(sql, [userId])
}

export async function getBreachById(breachId: number, userId: number) {
  const sql = "SELECT * FROM breaches WHERE id = ? AND user_id = ?"
  const results = (await query(sql, [breachId, userId])) as any[]
  return results.length ? results[0] : null
}

export async function updateBreachStatus(breachId: number, userId: number, status: string) {
  const sql = "UPDATE breaches SET status = ? WHERE id = ? AND user_id = ?"
  return query(sql, [status, breachId, userId])
}

// Alert-related queries
export async function getAlertsByUserId(userId: number) {
  const sql = "SELECT * FROM alerts WHERE user_id = ? ORDER BY created_at DESC"
  return query(sql, [userId])
}

// Database schema setup
export async function setupDatabase() {
  // Create users table
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `)

  // Create breaches table
  await query(`
    CREATE TABLE IF NOT EXISTS breaches (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      source VARCHAR(255) NOT NULL,
      description TEXT,
      affected_data JSON,
      status ENUM('New', 'Active', 'Resolved') DEFAULT 'New',
      detected_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `)

  // Create alerts table
  await query(`
    CREATE TABLE IF NOT EXISTS alerts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      breach_id INT,
      title VARCHAR(255) NOT NULL,
      message TEXT,
      priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (breach_id) REFERENCES breaches(id) ON DELETE SET NULL
    )
  `)

  // Create user_preferences table
  await query(`
    CREATE TABLE IF NOT EXISTS user_preferences (
      user_id INT PRIMARY KEY,
      email_alerts BOOLEAN DEFAULT TRUE,
      in_app_alerts BOOLEAN DEFAULT TRUE,
      weekly_digest BOOLEAN DEFAULT FALSE,
      data_sharing BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `)

  console.log("Database schema setup complete")
}
