import React from "react";

import { useRecipeContext } from "../context/RecipeContext";
import { useNavigate } from "react-router-dom";
import RecipeForm from "./AddRecipe";

const AddRecipePage = () => {
  const { createRecipe, loading } = useRecipeContext();
  const navigate = useNavigate();

  const handleCreate = async (formData) => {
    await createRecipe(formData);
    navigate("/recipes"); // or wherever after adding
  };

  return (
    <div>
      <h1>Add Recipe</h1>
      <RecipeForm initialData={{}} onSubmit={handleCreate} loading={loading} />
    </div>
  );
};

export default AddRecipePage;
