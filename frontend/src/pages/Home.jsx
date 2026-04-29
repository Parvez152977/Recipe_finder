import { useState, useEffect } from 'react';
import RecipeCard from '../components/RecipeCard';
import SearchBar from '../components/SearchBar';
import { searchRecipes, getRandomRecipes } from '../services/api';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Define loadRandomRecipes FIRST
  const loadRandomRecipes = async () => {
    setLoading(true);
    const data = await getRandomRecipes();
    setRecipes(data.recipes);
    setLoading(false);
  };

  // Define handleSearch SECOND
  const handleSearch = async (query) => {
    setLoading(true);
    const data = await searchRecipes(query);
    setRecipes(data.results);
    setLoading(false);
  };

  // Define handleRecipeClick THIRD
  const handleRecipeClick = (id) => {
    alert(`Recipe ${id} clicked - detail view coming soon!`);
  };

  // useEffect to load recipes when component mounts
  useEffect(() => {
    loadRandomRecipes();
  }, []); // Empty dependency array means run once on mount

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="container">
      <div className="app-header">
        <h1>🍳 Recipe Finder</h1>
        <p>Discover delicious recipes</p>
      </div>
      
      <SearchBar onSearch={handleSearch} />
      
      <div className="recipes-grid">
        {recipes.map(recipe => (
          <RecipeCard 
            key={recipe.id} 
            recipe={recipe} 
            onClick={handleRecipeClick}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;