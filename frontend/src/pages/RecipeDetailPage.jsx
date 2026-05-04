import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecipeDetails, checkFavorite, addFavorite, removeFavorite } from '../services/api';

const RecipeDetailPage = ({ userId }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    if (id) {
      loadRecipe();
    }
  }, [id]);

  useEffect(() => {
    if (userId && recipe) {
      checkFavoriteStatus();
    }
  }, [userId, recipe]);

  const loadRecipe = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRecipeDetails(id);
      if (data.success) {
        setRecipe(data.recipe);
      } else {
        setError(data.error || 'Failed to load recipe');
      }
    } catch (err) {
      setError('Error loading recipe');
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const res = await checkFavorite(userId, id);
      setIsFav(res.isFavorite);
    } catch (err) {
      console.error('Error checking favorite:', err);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!userId) {
      alert('Please log in to save favorites');
      return;
    }

    try {
      if (isFav) {
        await removeFavorite(userId, id);
        setIsFav(false);
      } else {
        await addFavorite({
          userId,
          recipeId: id,
          recipeTitle: recipe.title,
          recipeImage: recipe.image,
          readyInMinutes: recipe.readyInMinutes
        });
        setIsFav(true);
      }
    } catch (error) {
      console.error('Favorite error:', error);
      alert('Failed to update favorites');
    }
  };

  if (loading) return <div className="loading">Loading recipe...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!recipe) return <div className="error">Recipe not found</div>;

  return (
    <div className="recipe-detail-page">
      <button className="back-btn" onClick={() => navigate('/')}>
        ← Back to Search
      </button>
      
      <div className="recipe-detail-container">
        <img 
          src={recipe.image} 
          alt={recipe.title}
          className="recipe-detail-hero-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/1200x600?text=No+Image';
          }}
        />
        
        <div className="recipe-detail-header">
          <h1>{recipe.title}</h1>
          <button 
            className={`favorite-large-btn ${isFav ? 'active' : ''}`}
            onClick={handleFavoriteToggle}
          >
            {isFav ? '❤️ Remove from Favorites' : '🤍 Save to Favorites'}
          </button>
        </div>
        
        <div className="recipe-meta">
          <span>⏱️ Ready in: {recipe.readyInMinutes} minutes</span>
          <span>🍽️ Servings: {recipe.servings}</span>
          <span>❤️ {recipe.aggregateLikes} likes</span>
        </div>
        
        <div className="recipe-section">
          <h2>🛒 Ingredients</h2>
          <ul className="ingredients-list-full">
            {recipe.extendedIngredients?.map((ingredient, index) => (
              <li key={index}>
                <span>•</span>
                {ingredient.original}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="recipe-section">
          <h2>📖 Instructions</h2>
          <div className="instructions-full">
            {recipe.instructions ? (
              <div dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
            ) : (
              <p>No instructions available for this recipe.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage;