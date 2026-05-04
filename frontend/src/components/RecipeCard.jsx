import React, { useState, useEffect } from 'react';
import { checkFavorite, addFavorite, removeFavorite } from '../services/api';

const RecipeCard = ({ recipe, userId }) => {
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    if (userId && recipe?.id) {
      checkFavorite(userId, recipe.id.toString()).then(res => {
        setIsFav(res.isFavorite);
      }).catch(console.error);
    }
  }, [userId, recipe?.id]);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    if (!userId) return;
    
    setFavLoading(true);
    try {
      if (isFav) {
        await removeFavorite(userId, recipe.id.toString());
        setIsFav(false);
      } else {
        await addFavorite({
          userId,
          recipeId: recipe.id.toString(),
          recipeTitle: recipe.title,
          recipeImage: recipe.image,
          readyInMinutes: recipe.readyInMinutes || 0
        });
        setIsFav(true);
      }
    } catch (error) {
      console.error('Favorite error:', error);
    } finally {
      setFavLoading(false);
    }
  };

  const handleCardClick = () => {
    window.open(`/recipe/${recipe.id}`, '_blank');
  };

  if (!recipe) return null;

  return (
    <div className="recipe-card" onClick={handleCardClick}>
      <div className="recipe-card-image-wrapper">
        <img 
          src={recipe.image} 
          alt={recipe.title}
          className="recipe-card-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
          }}
        />
        <button 
          className={`favorite-btn ${isFav ? 'active' : ''}`}
          onClick={handleFavoriteClick}
          disabled={favLoading}
        >
          {isFav ? '❤️' : '🤍'}
        </button>
      </div>
      <div className="recipe-card-content">
        <h3 className="recipe-card-title">{recipe.title}</h3>
        <div className="recipe-card-info">
          <span>⏱️ {recipe.readyInMinutes || 'N/A'} min</span>
          <span>❤️ {recipe.aggregateLikes || 0} likes</span>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;