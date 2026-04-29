const RecipeCard = ({ recipe, onClick }) => {
  return (
    <div className="recipe-card" onClick={() => onClick(recipe.id)}>
      <img src={recipe.image} alt={recipe.title} />
      <h3>{recipe.title}</h3>
      <p>⏱️ {recipe.readyInMinutes} min | ❤️ {recipe.aggregateLikes}</p>
    </div>
  );
};

export default RecipeCard;