import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

// Create context
const RecipeContext = createContext();

// Provider
export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);        // all recipes
  const [userRecipes, setUserRecipes] = useState([]); // logged-in user recipes
  const [recipeById, setRecipeById] = useState(null); // single recipe
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create recipe
  const createRecipe = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      await axios.post("http://localhost:5000/api/recipes", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Recipe created successfully!");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Something went wrong";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Get all recipes for logged-in user
  const getUserRecipes = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/api/recipes/myrecipe/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUserRecipes(res.data);
    } catch (err) {
      console.error(err);
      setUserRecipes([]);
      const msg = err.response?.data?.message || "Failed to fetch user recipes";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Get single recipe by ID
  const getRecipeById = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(`http://localhost:5000/api/recipes/${id}`);
      setRecipeById(res.data);
    } catch (err) {
      console.error(err);
      setRecipeById(null);
      const msg = err.response?.data?.message || "Failed to fetch recipe";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Get all recipes
  const getAllRecipe = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get("http://localhost:5000/api/recipes");
      setRecipes(res.data);
    } catch (err) {
      console.error(err);
      setRecipes([]);
      const msg = err.response?.data?.message || "Failed to fetch recipes";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        userRecipes,
        recipeById,
        createRecipe,
        getUserRecipes,
        getRecipeById,
        getAllRecipe,
        loading,
        error,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

// Hook to use context
export const useRecipeContext = () => useContext(RecipeContext);
