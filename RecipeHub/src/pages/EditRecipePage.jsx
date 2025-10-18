import React, { useEffect, useState } from "react";
import RecipeForm from "./AddRecipe";
import { useRecipeContext } from "../context/RecipeContext";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../axiosInstance";

const EditRecipePage = () => {
  const { id } = useParams();
  const { updateRecipe, loading } = useRecipeContext();
  const [recipeData, setRecipeData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchRecipe() {
      const res = await axiosInstance.get(`/recipes/${id}`);
      setRecipeData(res.data);
    }
    fetchRecipe();
  }, [id]);

  const handleUpdate = async (formData) => {
    await updateRecipe(id, formData);
    navigate(`/recipedetails/${id}`);
  };

  if (!recipeData) return <p>Loading...</p>;

  return (
    <div>
      <h1>Edit Recipe</h1>
      <RecipeForm
        initialData={recipeData}
        onSubmit={handleUpdate}
        loading={loading}
      />
    </div>
  );
};

export default EditRecipePage;
