const express = require('express');
const cors = require('cors');
const recipeRoutes = require('./routes/recipeRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const rateLimiter = require('./middleware/rateLimiter');

// NO dotenv.config() here - already loaded in server.js

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(rateLimiter);

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/recipes', recipeRoutes);
app.use('/api/favorites', favoriteRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date(),
    uptime: process.uptime(),
    env: {
      apiKeyConfigured: !!process.env.API_KEY,
      apiUrl: process.env.API_URL
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Recipe Finder API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      search: '/api/recipes/search?query=pizza',
      random: '/api/recipes/random',
      details: '/api/recipes/:id',
      favorites: '/api/favorites/:userId'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.url}`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

module.exports = app;