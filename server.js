require("dotenv").config() // Load environment variables first

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000; // ✅ Defined early

const express = require("express")
const mysql = require("mysql2/promise")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const compression = require("compression")
const morgan = require("morgan")
const path = require("path")
const { exec } = require("child_process") // For showing port usage (Windows)

const app = express()

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "contact_keeper_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

// Create connection pool
const pool = mysql.createPool(dbConfig)

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection()
    console.log("✅ Database connected successfully")
    connection.release()
  } catch (error) {
    console.error("❌ Database connection failed:", error.message)
    process.exit(1)
  }
}

// Optional: Show port usage on Windows
function showPortUsage(port) {
  if (process.platform === "win32") {
    exec(`netstat -ano | findstr :${port}`, (err, stdout) => {
      if (stdout) {
        console.log(`💡 Port ${port} is in use:\n${stdout.trim()}\n➡️ Use "taskkill /PID <PID> /F" to kill it.`)
      }
    })
  }
}

// Start server with dynamic port fallback
async function startServer(port = PORT) {
  try {
    await testConnection()

    const server = app.listen(port, () => {
      console.log(`🚀 Contact Keeper API is running on port ${port}`)
      console.log(`📡 API Base URL: http://localhost:${port}/api`)
      console.log(`🔗 Health Check: http://localhost:${port}/api/health`)
      console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || "http://localhost:3000"}`)
    })

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.warn(`⚠️  Port ${port} is in use. Trying port ${port + 1}...`)
        showPortUsage(port)
        startServer(port + 1)
      } else {
        console.error("❌ Failed to start server:", err)
        process.exit(1)
      }
    })
  } catch (error) {
    console.error("❌ Failed to initialize server:", error)
    process.exit(1)
  }
}

// Start it
startServer()
