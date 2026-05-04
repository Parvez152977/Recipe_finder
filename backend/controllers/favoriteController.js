const db = require('../models/database');

// Get user's favorite recipes
const getFavorites = (req, res) => {
  const { userId } = req.params;
  
  if (!userId || isNaN(parseInt(userId))) {
    return res.status(400).json({ 
      success: false, 
      error: 'Valid user ID is required' 
    });
  }
  
  db.all(
    `SELECT * FROM favorites WHERE user_id = ? ORDER BY saved_at DESC`,
    [parseInt(userId)],
    (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          success: false, 
          error: 'Failed to fetch favorites' 
        });
      }
      
      res.json({ 
        success: true, 
        favorites: rows,
        count: rows.length
      });
    }
  );
};

// Add recipe to favorites
const addFavorite = (req, res) => {
  const { userId, recipeId, recipeTitle, recipeImage, readyInMinutes } = req.body;
  
  // Validate required fields
  if (!userId || !recipeId) {
    return res.status(400).json({ 
      success: false, 
      error: 'User ID and Recipe ID are required' 
    });
  }
  
  db.run(
    `INSERT OR IGNORE INTO favorites (user_id, recipe_id, recipe_title, recipe_image, ready_in_minutes) 
     VALUES (?, ?, ?, ?, ?)`,
    [parseInt(userId), String(recipeId), recipeTitle || '', recipeImage || '', readyInMinutes || 0],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          success: false, 
          error: 'Failed to add favorite' 
        });
      }
      
      if (this.changes === 0) {
        return res.json({ 
          success: false, 
          message: 'Recipe already in favorites' 
        });
      }
      
      res.json({ 
        success: true, 
        message: 'Added to favorites',
        favoriteId: this.lastID
      });
    }
  );
};

// Remove recipe from favorites
const removeFavorite = (req, res) => {
  const { userId, recipeId } = req.params;
  
  if (!userId || !recipeId) {
    return res.status(400).json({ 
      success: false, 
      error: 'User ID and Recipe ID are required' 
    });
  }
  
  db.run(
    `DELETE FROM favorites WHERE user_id = ? AND recipe_id = ?`,
    [parseInt(userId), String(recipeId)],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          success: false, 
          error: 'Failed to remove favorite' 
        });
      }
      
      res.json({ 
        success: true, 
        message: 'Removed from favorites',
        deleted: this.changes
      });
    }
  );
};

// Check if recipe is favorited
const isFavorite = (req, res) => {
  const { userId, recipeId } = req.params;
  
  if (!userId || !recipeId) {
    return res.status(400).json({ 
      success: false, 
      error: 'User ID and Recipe ID are required' 
    });
  }
  
  db.get(
    `SELECT id FROM favorites WHERE user_id = ? AND recipe_id = ?`,
    [parseInt(userId), String(recipeId)],
    (err, row) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          error: 'Database error' 
        });
      }
      
      res.json({ 
        isFavorite: !!row,
        favoriteId: row?.id || null
      });
    }
  );
};

// Get favorite count for a user
const getFavoriteCount = (req, res) => {
  const { userId } = req.params;
  
  db.get(
    `SELECT COUNT(*) as count FROM favorites WHERE user_id = ?`,
    [parseInt(userId)],
    (err, row) => {
      if (err) {
        return res.status(500).json({ success: false, error: 'Database error' });
      }
      
      res.json({ success: true, count: row.count });
    }
  );
};

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
  getFavoriteCount
};