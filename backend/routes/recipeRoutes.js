const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

// GET /api/recipes/search?query=pizza&diet=vegetarian&maxReadyTime=30
router.get('/search', recipeController.searchRecipes);

// GET /api/recipes/random?count=10
router.get('/random', recipeController.getRandomRecipes);

// GET /api/recipes/clear-cache (optional - for debugging)
router.get('/clear-cache', recipeController.clearCache);

// GET /api/recipes/:id
router.get('/:id', recipeController.getRecipeDetails);

module.exports = router;