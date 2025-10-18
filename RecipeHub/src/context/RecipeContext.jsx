import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";

// Create context
const RecipeContext = createContext();

// Provider
export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);        // all recipes
  const [followedRecipes,setfollowedRecipes]=useState([])
  const [userRecipes, setUserRecipes] = useState([]); // logged-in user recipes
  const [recipeById, setRecipeById] = useState(null); // single recipe
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate=useNavigate()

  // Create recipe
  const createRecipe = async (formData) => {
    setLoading(true);
    setError(null);

    try {
    

      await axiosInstance.post("http://localhost:5000/api/recipes", formData);

      toast.success("Recipe created successfully!");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Something went wrong";
      setError(msg);
      if(err.response?.status==401){
      navigate('/signup')
      }
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Update recipe
const updateRecipe = async (recipeId, formData) => {
  setLoading(true);
  setError(null);

  try {
    await axiosInstance.put(`http://localhost:5000/api/recipes/${recipeId}`, formData);

    toast.success("Recipe updated successfully!");
  } catch (err) {
    console.error(err);
    const msg = err.response?.data?.message || "Something went wrong";
    setError(msg);
    if (err.response?.status === 401) {
      navigate('/signup');
    }
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

  const deleteRecipe = async (id) => {
  try {
    const confirmDelete = window.confirm("Are you sure you want to delete this recipe?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    // Show loading toast
    const toastId = toast.loading("Deleting recipe...");

    const res = await axios.delete(`http://localhost:5000/api/recipes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Dismiss loading and show success
    toast.dismiss(toastId);
    toast.success("Recipe deleted successfully!");
    window.history.back();

  } catch (error) {
    console.error(error);
    toast.dismiss(); // Remove any loading toast
    toast.error("Failed to delete the recipe.");
  }
};

const getFollowedUsersRecipes =async()=>{
  try {
   const res= await axiosInstance.get('/recipes/feed/my')
   setfollowedRecipes(res.data)

  } catch (error) {
    console.log(error);
    
    
  }
}

const toggleLike=async(id)=>{
  try {
   const res= await axiosInstance.post(`/recipes/${id}/like`)
   console.log(res);
    getRecipeById(id);
   if (res.data.liked) {
         toast.success("Recipe liked!");

   }
   
    
  } catch (error) {
    console.log(error);
     if(error.response?.status==401){
      navigate('/signup')
      }
    
  }
}

const searchRecipe=async(search)=>{
  console.log('params', search);
  
  try {
      const res= await axiosInstance.get(`/recipes/search?q=${search}`)
      console.log('search',res.data);
      setRecipes(res.data);
      
  } catch (error) {
      console.log(error);
      
  }
}

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        userRecipes,
        recipeById,
        followedRecipes,
        createRecipe,
        getUserRecipes,
        getRecipeById,
        getAllRecipe,
        getFollowedUsersRecipes,
        loading,
        error,
        deleteRecipe,
        toggleLike,
        updateRecipe,
        searchRecipe
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

// Hook to use context
export const useRecipeContext = () => useContext(RecipeContext);
