const axios = require('axios');

class RecipeService {
  constructor() {
    this.baseURL = process.env.API_URL || 'https://api.spoonacular.com';
    this.apiKey = process.env.API_KEY;
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Get from cache or fetch
  async getCachedOrFetch(key, fetchFunction) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      console.log(`✅ Cache hit for: ${key}`);
      return cached.data;
    }
    
    console.log(`❌ Cache miss for: ${key}, fetching from API`);
    const data = await fetchFunction();
    this.cache.set(key, { data, timestamp: Date.now() });
    return data;
  }

  async searchRecipes(query, filters = {}) {
    // Check if API key exists
    if (!this.apiKey) {
      console.error('❌ API_KEY is missing! Check your .env file');
      return {
        success: false,
        error: 'API key not configured',
        message: 'Please add your Spoonacular API key to .env file'
      };
    }

    try {
      const params = {
        apiKey: this.apiKey,  // ← CRITICAL: API key must be here
        query: query,
        number: filters.number || 20,
        addRecipeInformation: true,
        fillIngredients: true,
      };

      // Add optional filters
      if (filters.diet && filters.diet !== '') params.diet = filters.diet;
      if (filters.intolerances) params.intolerances = filters.intolerances;
      if (filters.maxReadyTime && filters.maxReadyTime > 0) {
        params.maxReadyTime = filters.maxReadyTime;
      }

      const cacheKey = `search_${query}_${JSON.stringify(filters)}`;
      
      const result = await this.getCachedOrFetch(cacheKey, async () => {
        console.log(`📡 Calling Spoonacular API: /recipes/complexSearch with query: ${query}`);
        const response = await axios.get(`${this.baseURL}/recipes/complexSearch`, { params });
        console.log(`✅ API returned ${response.data.results?.length || 0} results`);
        
        return {
          success: true,
          results: response.data.results,
          totalResults: response.data.totalResults,
          query: query,
          fromCache: false
        };
      });

      return { ...result, fromCache: true };
    } catch (error) {
      console.error('API Error Details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      return {
        success: false,
        error: 'Failed to fetch recipes',
        message: error.response?.data?.message || error.message,
        status: error.response?.status
      };
    }
  }

  async getRecipeById(id) {
    if (!this.apiKey) {
      return {
        success: false,
        error: 'API key not configured',
        message: 'Please add your Spoonacular API key to .env file'
      };
    }

    try {
      const cacheKey = `recipe_${id}`;
      
      const result = await this.getCachedOrFetch(cacheKey, async () => {
        console.log(`📡 Fetching recipe details for ID: ${id}`);
        const response = await axios.get(`${this.baseURL}/recipes/${id}/information`, {
          params: {
            apiKey: this.apiKey,  // ← CRITICAL: API key here too
            includeNutrition: true
          }
        });
        
        return {
          success: true,
          recipe: response.data,
          fromCache: false
        };
      });

      return result;
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      return {
        success: false,
        error: 'Failed to fetch recipe details',
        message: error.response?.data?.message || error.message
      };
    }
  }

  async getRandomRecipes(count = 10) {
    if (!this.apiKey) {
      return {
        success: false,
        error: 'API key not configured',
        message: 'Please add your Spoonacular API key to .env file'
      };
    }

    try {
      const cacheKey = `random_${count}`;
      
      const result = await this.getCachedOrFetch(cacheKey, async () => {
        console.log(`📡 Fetching ${count} random recipes`);
        const response = await axios.get(`${this.baseURL}/recipes/random`, {
          params: {
            apiKey: this.apiKey,  // ← CRITICAL: API key here too
            number: Math.min(count, 20)
          }
        });
        
        return {
          success: true,
          recipes: response.data.recipes,
          fromCache: false
        };
      });

      return result;
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      return {
        success: false,
        error: 'Failed to fetch random recipes',
        message: error.response?.data?.message || error.message
      };
    }
  }

  clearCache() {
    this.cache.clear();
    console.log('🗑️ Cache cleared');
  }
}

module.exports = new RecipeService();