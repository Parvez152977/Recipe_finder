import React, { useState, useEffect } from 'react';
import { getFavorites, removeFavorite, getRecipeDetails } from '../services/api';

const FavoritesPage = ({ userId }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Define loadFavorites FIRST
  const loadFavorites = async () => {
    setLoading(true);
    try {
      const data = await getFavorites(userId);
      if (data.success) {
        setFavorites(data.favorites);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  // Define handleRemoveFavorite SECOND
  const handleRemoveFavorite = async (recipeId) => {
    try {
      await removeFavorite(userId, recipeId);
      // Remove from local state
      setFavorites(favorites.filter(fav => fav.recipe_id !== recipeId));
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Failed to remove from favorites');
    }
  };

  // Define handleViewRecipe THIRD
  const handleViewRecipe = async (recipeId) => {
    try {
      const data = await getRecipeDetails(recipeId);
      if (data.success) {
        setSelectedRecipe(data.recipe);
      }
    } catch (error) {
      console.error('Error loading recipe:', error);
    }
  };

  // Define closeModal FOURTH
  const closeModal = () => {
    setSelectedRecipe(null);
  };

  // Use useEffect AFTER all functions are defined
  useEffect(() => {
    if (userId) {
      loadFavorites();
    }
  }, [userId]);

  if (loading) {
    return <div className="loading">Loading your favorites...</div>;
  }

  return (
    <div className="container">
      <div className="app-header">
        <h1>❤️ My Favorite Recipes</h1>
        <p>Your saved collection of delicious recipes</p>
      </div>

      {favorites.length === 0 ? (
        <div className="empty-favorites">
          <p>😢 You haven't saved any favorites yet!</p>
          <p>Go to the home page and click the ❤️ button on recipes you like.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="browse-btn"
          >
            Browse Recipes
          </button>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((fav) => (
            <div key={fav.id} className="favorite-card">
              <img 
                src={fav.recipe_image || 'https://via.placeholder.com/300x200?text=No+Image'} 
                alt={fav.recipe_title}
                className="favorite-card-image"
                onClick={() => handleViewRecipe(fav.recipe_id)}
              />
              <div className="favorite-card-content">
                <h3 
                  className="favorite-card-title"
                  onClick={() => handleViewRecipe(fav.recipe_id)}
                >
                  {fav.recipe_title}
                </h3>
                <div className="favorite-card-info">
                  <span>⏱️ {fav.ready_in_minutes || 'N/A'} min</span>
                  <span>📅 Saved: {new Date(fav.saved_at).toLocaleDateString()}</span>
                </div>
                <button 
                  className="remove-favorite-btn"
                  onClick={() => handleRemoveFavorite(fav.recipe_id)}
                >
                  ❌ Remove from Favorites
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            
            <img 
              src={selectedRecipe.image} 
              alt={selectedRecipe.title}
              className="recipe-detail-image"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x400?text=No+Image';
              }}
            />
            
            <div className="recipe-detail-content">
              <h1 className="recipe-detail-title">{selectedRecipe.title}</h1>
              
              <div className="recipe-meta">
                <span>⏱️ Ready in: {selectedRecipe.readyInMinutes} minutes</span>
                <span>🍽️ Servings: {selectedRecipe.servings}</span>
                <span>❤️ {selectedRecipe.aggregateLikes} likes</span>
              </div>
              
              <h2>🛒 Ingredients</h2>
              <ul className="ingredients-list">
                {selectedRecipe.extendedIngredients?.map((ingredient, index) => (
                  <li key={index}>
                    <span>•</span>
                    {ingredient.original}
                  </li>
                ))}
              </ul>
              
              <h2>📖 Instructions</h2>
              <div className="instructions">
                {selectedRecipe.instructions ? (
                  <div dangerouslySetInnerHTML={{ __html: selectedRecipe.instructions }} />
                ) : (
                  <p>No instructions available for this recipe.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;