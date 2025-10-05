import React, { useContext, useEffect } from 'react'
import { useRecipeContext } from '../context/RecipeContext'
import RecipeCard from '../component/cards/RecipeCard';

function HomePage() {
    const {recipes,getAllRecipe}=useRecipeContext()
    console.log(recipes);

     useEffect(()=>{
  getAllRecipe()
  },[])
    
  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 bg-white lg:px-6  py-4 shadow-md rounded-2xl'>
      {
        recipes?.map(items=>(
            <div>
               <RecipeCard recipe={items}/>
            </div>
        ))
      }
    </div>
  )
}

export default HomePage
