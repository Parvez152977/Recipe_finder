import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`📤 ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(`📥 API Error:`, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Recipe endpoints
export const searchRecipes = async (query, filters = {}) => {
  try {
    const response = await api.get('/recipes/search', {
      params: { query, ...filters }
    });
    return response.data;
  } catch (error) {
    console.error('Search error:', error);
    return {
      success: false,
      error: 'Failed to search recipes',
      message: error.response?.data?.message || error.message
    };
  }
};

export const getRecipeDetails = async (id) => {
  try {
    const response = await api.get(`/recipes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Details error:', error);
    return {
      success: false,
      error: 'Failed to fetch recipe details'
    };
  }
};

export const getRandomRecipes = async (count = 10) => {
  try {
    const response = await api.get('/recipes/random', {
      params: { count }
    });
    return response.data;
  } catch (error) {
    console.error('Random recipes error:', error);
    return {
      success: false,
      error: 'Failed to fetch random recipes',
      recipes: []
    };
  }
};

// Favorite endpoints
export const getFavorites = async (userId) => {
  try {
    const response = await api.get(`/favorites/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Get favorites error:', error);
    return { success: false, favorites: [] };
  }
};

export const addFavorite = async (favoriteData) => {
  try {
    const response = await api.post('/favorites', favoriteData);
    return response.data;
  } catch (error) {
    console.error('Add favorite error:', error);
    return { success: false };
  }
};

export const removeFavorite = async (userId, recipeId) => {
  try {
    const response = await api.delete(`/favorites/${userId}/${recipeId}`);
    return response.data;
  } catch (error) {
    console.error('Remove favorite error:', error);
    return { success: false };
  }
};

export const checkFavorite = async (userId, recipeId) => {
  try {
    const response = await api.get(`/favorites/check/${userId}/${recipeId}`);
    return response.data;
  } catch (error) {
    console.error('Check favorite error:', error);
    return { isFavorite: false };
  }
};

export default api;