import React from "react";
import { CiBookmark, CiUser, CiTimer, CiHeart } from "react-icons/ci";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

function RecipeCard({ recipe }) {
  const handleBookmark = (e) => {
    e.stopPropagation();
    e.preventDefault();
    toast.success("Recipe bookmarked!");
  };

  return (
    <div className="relative bg-white h-fit rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden max-w-4xl w-full mx-auto">
      {/* --- Fixed Bookmark --- */}
      <span className="absolute top-0 -right-3 lg:bg-transparent  bg-white/70 rounded-2xl p-2 z-30">
      <CiBookmark
        size={26}
        className=" cursor-pointer  text-gray-700 hover:text-gray-900 transition"
        onClick={handleBookmark}
      />
      </span>

      <div className="flex flex-col sm:flex-row">
        {/* --- Image Section --- */}
        <Link to={`/recipedetails/${recipe._id}`} className="relative flex-shrink-0 w-full sm:w-1/3">
          <img
            src={recipe?.mainPhoto}
            alt={recipe?.title}
            className="h-72  w-full object-cover sm:h-full"
          />

          {/* Likes Badge */}
          <span className="flex items-center gap-1 absolute top-2 left-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md shadow">
            <CiHeart size={20} className="text-gray-700" />
            <p className="text-sm text-gray-800 font-medium">{recipe?.likes?.length}</p>
          </span>
        </Link>

        {/* --- Content Section --- */}
        <div className="flex flex-col justify-between p-4 flex-grow">
          {/* Clickable area (navigates to recipe details) */}
          <Link to={`/recipedetails/${recipe._id}`}>
            <div>
              <h3 className="capitalize  font-bold text-lg sm:text-xl mb-1 line-clamp-1">
                {recipe?.title}
              </h3>
              <p className="text-gray-600 text-sm  line-clamp-3 mb-3">
                {recipe?.description}
              </p>

              <div className="flex flex-col gap-1 text-sm text-gray-700">
                <span className="flex items-center gap-1">
                  <CiUser />
                  <p>Serves: {recipe?.serves}</p>
                </span> 
                <span className="flex items-center gap-1">
                  <CiTimer />
                  <p>Cook Time: {recipe?.cookTime}</p>
                </span>
              </div>
            </div>
          </Link>

          {/* --- User Info (non-clickable) --- */}
          <Link
          to={`/profile/${recipe?.user?._id}`}
            className="flex items-center gap-2 mt-4 sm:mt-2 cursor-pointer w-fit"
          >
            <img
              src={recipe?.user?.avatar||'/public/cheflogo.png' }
              alt={recipe?.user?.name} 
              className="h-8 w-8 rounded-full object-cover"
            />
            <p className="text-sm capitalize text-gray-800 font-medium">
              {recipe?.user?.name}
            </p>
          </Link>
        </div>
      </div>  
    </div>
  );
}

export default RecipeCard;
