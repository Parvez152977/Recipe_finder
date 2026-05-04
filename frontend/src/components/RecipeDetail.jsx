const RecipeDetail = ({ recipe, onClose }) => {
  if (!recipe) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <img 
          src={recipe.image} 
          alt={recipe.title}
          className="recipe-detail-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/800x400?text=No+Image';
          }}
        />
        
        <div className="recipe-detail-content">
          <h1 className="recipe-detail-title">{recipe.title}</h1>
          
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <span>⏱️ Ready in: {recipe.readyInMinutes} minutes</span>
            <span>🍽️ Servings: {recipe.servings}</span>
            <span>❤️ {recipe.aggregateLikes} likes</span>
            {recipe.vegetarian && <span>🥬 Vegetarian</span>}
            {recipe.vegan && <span>🌱 Vegan</span>}
            {recipe.glutenFree && <span>🌾 Gluten Free</span>}
          </div>
          
          <h2>🛒 Ingredients</h2>
          <ul className="ingredients-list">
            {recipe.extendedIngredients?.map((ingredient, index) => (
              <li key={index}>
                <span>•</span>
                {ingredient.original}
              </li>
            ))}
          </ul>
          
          <h2>📖 Instructions</h2>
          <div className="instructions">
            {recipe.instructions ? (
              <div dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
            ) : (
              <p>No instructions available for this recipe.</p>
            )}
          </div>
          
          {recipe.sourceUrl && (
            <a 
              href={recipe.sourceUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                marginTop: '20px',
                padding: '10px 20px',
                background: '#667eea',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px'
              }}
            >
              View Full Recipe Source →
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;