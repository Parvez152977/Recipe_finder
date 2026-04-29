import { mockRecipes } from '../mockData';

export const searchRecipes = async (query) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const results = mockRecipes.filter(recipe =>
    recipe.title.toLowerCase().includes(query.toLowerCase())
  );
  
  return { success: true, results };
};

export const getRandomRecipes = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true, recipes: mockRecipes };
};