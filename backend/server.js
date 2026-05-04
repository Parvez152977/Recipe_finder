// Load environment variables FIRST - before anything else
const dotenv = require('dotenv');
const result = dotenv.config();

if (result.error) {
  console.error('❌ Error loading .env file:', result.error);
  process.exit(1);
}

console.log('✅ Environment variables loaded:');
console.log(`   PORT: ${process.env.PORT || '5000'}`);
console.log(`   API_KEY: ${process.env.API_KEY ? '✓ Set (length: ' + process.env.API_KEY.length + ')' : '✗ MISSING'}`);
console.log(`   API_URL: ${process.env.API_URL || 'https://api.spoonacular.com'}`);

const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/health`);
  console.log(`🍳 Recipe API: http://localhost:${PORT}/api/recipes/search?query=pizza`);
});