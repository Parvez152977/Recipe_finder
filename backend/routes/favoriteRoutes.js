const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');

// GET /api/favorites/:userId - Get user's favorites
router.get('/:userId', favoriteController.getFavorites);

// GET /api/favorites/count/:userId - Get favorite count
router.get('/count/:userId', favoriteController.getFavoriteCount);

// POST /api/favorites - Add to favorites
router.post('/', favoriteController.addFavorite);

// DELETE /api/favorites/:userId/:recipeId - Remove from favorites
router.delete('/:userId/:recipeId', favoriteController.removeFavorite);

// GET /api/favorites/check/:userId/:recipeId - Check if favorited
router.get('/check/:userId/:recipeId', favoriteController.isFavorite);

module.exports = router;