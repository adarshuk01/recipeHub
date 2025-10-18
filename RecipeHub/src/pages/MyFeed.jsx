import React, { useEffect } from 'react'
import { useRecipeContext } from '../context/RecipeContext'
import RecipeCard from '../component/cards/RecipeCard'
import PostCard from '../component/cards/FeedPost'

function MyFeed() {

    const { getFollowedUsersRecipes, followedRecipes } = useRecipeContext()

    useEffect(() => {
        getFollowedUsersRecipes()
    }, [])

    return (
        <div className=' lg:px-6 lg:bg-white  py-4'>
            <h2 className='text-2xl cursive'>Recipe based on your follows!</h2>
              <div className='grid grid-cols-1 lg:grid-cols-4 gap-4  rounded-2xl mt-4'>
      {
        followedRecipes?.map(items=>(
            <div>
              <PostCard post={items}/>
            </div>
        ))
      }
    </div>

        </div>
    )
}

export default MyFeed

