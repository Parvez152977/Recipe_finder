const recipeService = require('../services/recipeService');

const searchRecipes = async (req, res) => {
  const { query, diet, intolerances, maxReadyTime, number } = req.query;
  
  if (!query || query.trim() === '') {
    return res.status(400).json({ 
      success: false, 
      error: 'Search query is required',
      message: 'Please enter a recipe name to search'
    });
  }

  const filters = {
    diet: diet || '',
    intolerances: intolerances || '',
    maxReadyTime: maxReadyTime ? parseInt(maxReadyTime) : null,
    number: number ? parseInt(number) : 20
  };

  const result = await recipeService.searchRecipes(query.trim(), filters);
  
  if (!result.success) {
    return res.status(result.status || 500).json(result);
  }
  
  res.json(result);
};

const getRecipeDetails = async (req, res) => {
  const { id } = req.params;
  
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ 
      success: false, 
      error: 'Valid recipe ID is required' 
    });
  }

  const result = await recipeService.getRecipeById(parseInt(id));
  
  if (!result.success) {
    return res.status(404).json(result);
  }
  
  res.json(result);
};

const getRandomRecipes = async (req, res) => {
  const count = req.query.count ? parseInt(req.query.count) : 10;
  const validCount = Math.min(Math.max(count, 1), 20); // Between 1 and 20
  
  const result = await recipeService.getRandomRecipes(validCount);
  
  if (!result.success) {
    return res.status(500).json(result);
  }
  
  res.json(result);
};

const clearCache = async (req, res) => {
  // Optional endpoint for debugging
  recipeService.clearCache();
  res.json({ success: true, message: 'Cache cleared successfully' });
};

module.exports = {
  searchRecipes,
  getRecipeDetails,
  getRandomRecipes,
  clearCache
};