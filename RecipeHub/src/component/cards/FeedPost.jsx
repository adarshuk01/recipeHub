import React from 'react';
import { CiHeart, CiChat2 } from "react-icons/ci"; // Using CiChat2 for comment icon
import { BsThreeDotsVertical } from "react-icons/bs"; // Using for the menu button
import { Link } from "react-router-dom"; // Assuming you use react-router-dom for navigation


function PostCard({ post }) {
  // Destructure with default values for safety
  const { 
    id = "123", 
    text = "My cat looking at the sun", 
    image = "default-cat-image.jpg", 
    likesCount = 110, 
    commentsCount = 32, 
    user = { 
      name: "Sam Guy", 
      handle: "@samguy", 
      avatar: "public/cheflogo.png" 
    } 
  } = post || {};

  // Placeholder functions for actions (replace with actual logic, e.g., API calls)
  const handleLike = () => console.log(`Post ${id} liked!`);
  const handleComment = () => console.log(`Post ${id} comment button clicked!`);
  const handleMenu = (e) => {
    e.stopPropagation();
    console.log(`Menu for post ${id} opened!`);
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
      {/* --- Header: User Info & Menu --- */}
      <div className="flex items-center justify-between p-3">
        <Link to={`/profile/${user._id}`} className="flex items-center gap-3 cursor-pointer">
          <img
            src={user?.avatar||'public/cheflogo.png'}
            alt={`${user.name}'s avatar`}
            className="h-10 w-10 rounded-full object-cover bg-gray-200"
            onError={(e) => { e.target.onerror = null; e.target.src = '/default-avatar.png'; }} // Fallback image
          />
          <div>
            <p className="font-semibold text-gray-900 leading-tight">{user.name}</p>
            <p className="text-sm text-gray-500 leading-tight">{user.handle}</p>
          </div>
        </Link>
        <BsThreeDotsVertical
          size={20}
          className="text-gray-500 cursor-pointer hover:text-gray-700 transition"
          onClick={handleMenu}
        />
      </div>

      {/* --- Image/Media Section --- */}
      <div className="aspect-square w-full">
        <img
          src={post.mainPhoto}
          alt={text}
          className="w-full h-full object-cover bg-gray-100"
        />
      </div>

      {/* --- Footer: Caption & Actions --- */}
      <div className="p-3 pt-2">
        {/* User Info (repeated for caption context, as shown in the image) */}
        <div className="">
          
          <Link to={`/recipedetails/${post._id}`} className="text-lg font-semibold text-gray-800 underline">{post?.title}</Link>
        </div>

        {/* Caption */}
        <p className="text-gray-500 mb-3 line-clamp-3 text-sm">{post?.description}</p>

        {/* Actions (Like & Comment) */}
        <div className="flex items-center gap-6 text-gray-600 border-t border-gray-100 pt-3">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className="flex items-center gap-1 hover:text-red-500 transition group"
            aria-label="Like post"
          >
            <CiHeart size={24} className="group-hover:fill-red-500" />
            <span className="text-sm">{post?.likes?.length}</span>
          </button>

          {/* Comment Button */}
          <button
            onClick={handleComment}
            className="flex items-center gap-1 hover:text-blue-500 transition group"
            aria-label="Comment on post"
          >
            <CiChat2 size={22} className="group-hover:fill-blue-500" />
            <span className="text-sm">{commentsCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostCard;