import React, { useEffect } from 'react'
import { useRecipeContext } from '../context/RecipeContext'
import { useParams } from 'react-router-dom'
import RecipeCard from '../component/cards/RecipeCard'
import SearchBar from '../component/common/SearchBar'

function Search() {
  const { searchRecipe, recipes } = useRecipeContext()
  const { q } = useParams()

  useEffect(() => {
    if (q) {
      searchRecipe(q)
    }
  }, [q])

  return (
    <div>
      <div className="bg-white px-4 py-6 shadow-md sm:px-6 md:px-10 lg:px-16 rounded-t-4xl space-y-6">
        {/* ✅ Reusable Search Bar */}
        <SearchBar initialQuery={q || ''} />

        {recipes && recipes.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No recipes found.</p>
        )}
      </div>
    </div>
  )
}

export default Search
