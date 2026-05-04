const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database file in backend folder
const dbPath = path.join(__dirname, '../recipes.db');
const db = new sqlite3.Database(dbPath);

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Initialize tables
db.serialize(() => {
  // Users table (simple for demo - no auth required)
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Favorites table
  db.run(`
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      recipe_id TEXT,
      recipe_title TEXT,
      recipe_image TEXT,
      ready_in_minutes INTEGER,
      saved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, recipe_id)
    )
  `);

  // Create indexes for performance
  db.run(`CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_favorites_recipe_id ON favorites(recipe_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_favorites_saved_at ON favorites(saved_at DESC)`);

  // Create a default user if none exists
  db.get("SELECT * FROM users LIMIT 1", (err, row) => {
    if (!err && !row) {
      db.run("INSERT INTO users (name) VALUES (?)", ["Recipe User"]);
      console.log("✅ Created default user (ID: 1)");
    } else {
      console.log("✅ Using existing database");
    }
  });

  // Count favorites for testing
  db.get("SELECT COUNT(*) as count FROM favorites", (err, row) => {
    console.log(`📊 Database has ${row?.count || 0} favorites saved`);
  });
});

console.log("✅ SQLite database initialized at:", dbPath);

module.exports = db;