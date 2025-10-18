import React from 'react'
import { useRecipeContext } from '../context/RecipeContext'
import RecipeCard from '../component/cards/RecipeCard'
import { FiSearch } from 'react-icons/fi'
import { ingredients } from '../data/Incredient_data'
import { Link } from 'react-router-dom'
import SearchBar from '../component/common/SearchBar'

function HomePage() {
  const { recipes } = useRecipeContext()
  console.log(recipes)

  return (
    <div className="">
      <div className="bg-white px-4 py-6 shadow-md sm:px-6 md:px-10 lg:px-16 rounded-t-4xl space-y-6">
        {/* Search Bar */}
       <SearchBar/>

        {/* Ingredients Scrollable List */}
        <div>
          <h3 className="text-2xl  font-semibold cursive  text-center">
            Search with Ingredients
          </h3>

          <div className="flex gap-4 overflow-x-auto p-6 justify-center  flex-wrap px-1 scrollbar-hide">
            {ingredients.map((item, index) => (
              <Link
              to={`/search/${item.name}`}
                key={index}
                className="flex flex-col items-center justify-center min-w-[80px] shadow-md p-6 sm:min-w-[100px] bg-gray-50 hover:bg-gray-100 rounded-xl  flex-shrink-0"
              >
                <img
                  className="w-20 h-20  object-cover rounded-full"
                  src={item.image}
                  alt={item.name}
                />
                <h3 className="-mt-2 text-lg  cursive text-center">{item.name}</h3>
              </Link>
            ))}
          </div>
        </div>

        {/* Recipe Cards (if applicable) */}
        {recipes && recipes.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage
