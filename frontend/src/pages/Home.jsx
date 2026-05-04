import { useState, useEffect } from 'react';
import RecipeCard from '../components/RecipeCard';
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';
import RecipeDetail from '../components/RecipeDetail';  // ADD THIS IMPORT
import { searchRecipes, getRandomRecipes, getRecipeDetails } from '../services/api';

const Home = ({ userId }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);  // ADD THIS
  const [currentQuery, setCurrentQuery] = useState('');
  const [filters, setFilters] = useState({});

  useEffect(() => {
    loadRandomRecipes();
  }, []);

  const loadRandomRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRandomRecipes(12);
      if (data.success) {
        setRecipes(data.recipes);
      } else {
        setError(data.error || 'Failed to load recipes');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    setCurrentQuery(query);
    try {
      const data = await searchRecipes(query, filters);
      if (data.success) {
        setRecipes(data.results);
      } else {
        setError(data.error || 'No recipes found');
      }
    } catch (err) {
      setError('Failed to search recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    if (key === 'reset') {
      setFilters({});
      if (currentQuery) {
        handleSearch(currentQuery);
      } else {
        loadRandomRecipes();
      }
    } else {
      const newFilters = { ...filters, [key]: value };
      setFilters(newFilters);
      if (currentQuery) {
        handleSearch(currentQuery);
      }
    }
  };

  // REPLACE the alert with this function
  const handleRecipeClick = async (id) => {
    setLoading(true);
    try {
      const data = await getRecipeDetails(id);
      if (data.success) {
        setSelectedRecipe(data.recipe);
      } else {
        alert('Failed to load recipe details');
      }
    } catch (err) {
      alert('Error loading recipe details');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedRecipe(null);
  };

  if (loading && !selectedRecipe) return <div className="loading">Loading...</div>;

  return (
    <div className="container">
      <div className="app-header">
        <h1>🍳 Recipe Finder</h1>
        <p>Discover delicious recipes from around the world</p>
      </div>
      
      <SearchBar onSearch={handleSearch} loading={loading} />
      <Filters filters={filters} onFilterChange={handleFilterChange} />

      {error && (
        <div className="error">
          {error}
          <button onClick={loadRandomRecipes}>Try Again</button>
        </div>
      )}

      {loading && <div className="loading">Loading delicious recipes...</div>}

      {!loading && !error && (
        <div className="recipes-grid">
          {recipes.map((recipe) => (
            <RecipeCard 
              key={recipe.id} 
              recipe={recipe} 
              onClick={handleRecipeClick}
              userId={userId}
            />
          ))}
        </div>
      )}

      {!loading && !error && recipes.length === 0 && (
        <div className="loading">No recipes found. Try searching for something else!</div>
      )}

      {/* ADD THE MODAL */}
      {selectedRecipe && (
        <RecipeDetail 
          recipe={selectedRecipe} 
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Home;