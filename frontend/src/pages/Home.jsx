import { useState, useEffect } from 'react';
import RecipeCard from '../components/RecipeCard';
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';
import { searchRecipes, getRandomRecipes } from '../services/api';

const Home = ({ userId }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});

  // Define loadRandomRecipes FIRST
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

  // Define performSearch SECOND (before it's used)
  const performSearch = async (query, filterParams = {}) => {
    if (!query.trim()) {
      loadRandomRecipes();
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const data = await searchRecipes(query, filterParams);
      if (data.success) {
        setRecipes(data.results);
      } else {
        setError(data.error || 'No recipes found');
        setRecipes([]);
      }
    } catch (err) {
      setError('Failed to search recipes');
    } finally {
      setLoading(false);
    }
  };

  // Define handleSearch THIRD
  const handleSearch = (query) => {
    setSearchQuery(query);
    performSearch(query, filters);
  };

  // Define handleFilterChange FOURTH
  const handleFilterChange = (key, value) => {
    if (key === 'reset') {
      setFilters({});
      if (searchQuery) {
        performSearch(searchQuery, {});
      } else {
        loadRandomRecipes();
      }
    } else {
      const newFilters = { ...filters, [key]: value };
      setFilters(newFilters);
      if (searchQuery) {
        performSearch(searchQuery, newFilters);
      }
    }
  };

  // Load random recipes on mount
  useEffect(() => {
    loadRandomRecipes();
  }, []);

  if (loading && recipes.length === 0) {
    return <div className="loading">Loading delicious recipes...</div>;
  }

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

      {!loading && !error && (
        <div className="recipes-grid">
          {recipes.map((recipe) => (
            <RecipeCard 
              key={recipe.id} 
              recipe={recipe} 
              userId={userId}
            />
          ))}
        </div>
      )}

      {!loading && !error && recipes.length === 0 && searchQuery && (
        <div className="loading">No recipes found for "{searchQuery}". Try something else!</div>
      )}

      {!loading && !error && recipes.length === 0 && !searchQuery && (
        <div className="loading">No recipes available. Please try searching!</div>
      )}
    </div>
  );
};

export default Home;