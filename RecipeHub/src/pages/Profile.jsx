import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRecipeContext } from '../context/RecipeContext';
import { Link } from 'react-router-dom';
import { IoLocationOutline } from "react-icons/io5";

// --- Empty Tab Content ---
function EmptyTabContent({ tabName }) {
    const heading =
        tabName === 'Recipes'
            ? 'Get started and create your first recipe!'
            : 'No Cooksnaps yet!';
    const subText =
        tabName === 'Recipes'
            ? "You haven't created any recipes. Write your first one and see it here!"
            : "Snap and share what you've cooked from other people's recipes!";
    const buttonText = tabName === 'Recipes' ? 'Create Recipe' : 'Add Cooksnap';

    return (
        <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-24 flex items-center justify-center">
                <div className="text-6xl text-gray-400">🍽️</div>
            </div>
            <h3 className="font-bold text-xl text-gray-800">{heading}</h3>
            <p className="text-gray-600 max-w-sm">{subText}</p>
            <button className="mt-4 px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition duration-150">
                {buttonText}
            </button>
        </div>
    );
}

// --- Recipes List ---
function RecipesList({ recipes = [] }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {recipes.map((recipe, index) => (
        <Link
          to={`/recipedetails/${recipe._id}`}
          key={index}
          className="flex flex-col md:flex-row bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
        >
          {/* Recipe Image */}
          <div className="w-full md:w-40 h-48 md:h-40 flex-shrink-0">
            <img
              src={recipe.mainPhoto || "/default-recipe.jpg"}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Recipe Info */}
          <div className="flex flex-col justify-between p-4 flex-grow">
            <div>
              <h4 className="font-semibold text-lg text-gray-800 line-clamp-1">
                {recipe.title}
              </h4>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {recipe.description}
              </p>
            </div>

            {/* Meta Info */}
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-gray-500">
                {recipe.cookingTime || "30 min"}
              </span>
              <button
                type="button"
                className="px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700 transition"
              >
                View Recipe
              </button>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

// --- Cooksnaps List ---
function CooksnapsList({ snaps = [] }) {
    return (
        <div className="grid md:grid-cols-3 gap-4">
            {snaps.map((snap, index) => (
                <div
                    key={index}
                    className="border rounded-lg p-2 shadow-sm hover:shadow-md transition"
                >
                    <img
                        src={snap.image || '/default-snap.jpg'}
                        alt="cooksnap"
                        className="w-full h-40 object-cover rounded-md"
                    />
                    <p className="mt-2 text-sm text-gray-600">{snap.caption}</p>
                </div>
            ))}
        </div>
    );
}

// --- Main Profile ---
function Profile() {
    const { user } = useContext(AuthContext);
    const { userRecipes, getUserRecipes, loading } = useRecipeContext();
    const [activeTab, setActiveTab] = useState('Recipes');

    // Example cooksnaps data
    const cooksnaps = user?.cooksnaps || [];

    const tabs = [
        { name: 'Recipes', count: userRecipes?.length || 0 },
        { name: 'Cooksnaps', count: cooksnaps?.length || 0 },
    ];

    // Fetch user's recipes when user is available
    useEffect(() => {
        if (user?._id) {
            getUserRecipes(user._id);
        }
    }, [user?._id]);

    const renderContent = () => {
        if (loading) {
            return <p className="text-center text-gray-500">Loading recipes...</p>;
        }

        if (activeTab === 'Recipes') {
            return userRecipes?.length > 0 ? (
                <RecipesList recipes={userRecipes} />
            ) : (
                <EmptyTabContent tabName="Recipes" />
            );
        } else {
            return cooksnaps?.length > 0 ? (
                <CooksnapsList snaps={cooksnaps} />
            ) : (
                <EmptyTabContent tabName="Cooksnaps" />
            );
        }
    };

    return (
        <div>
            <div className="max-w-4xl mx-auto shadow-md bg-white p-6 space-y-4">
                {/* User Info */}
                <div className="flex justify-between flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <img
                            className="w-16 h-16 rounded-full cursor-pointer"
                            src={user?.avatar || '/cheflogo.png'}
                            alt="profile"
                        />
                        <div>
                            <h4 className="font-semibold text-gray-800 capitalize">
                                {user?.name || 'User'}
                            </h4>
                            <p className="text-gray-500 text-sm">{user?.email}</p>
                            {user?.location &&
                                <p className='text-gray-500 text-sm flex items-center gap-1 capitalize'>
                                    <IoLocationOutline /> {user?.location}
                                </p>
                            }
                        </div>
                    </div>

                    <div className="flex justify-center lg:w-fit gap-4 w-full">
                        <span className="flex flex-col items-center">
                            <span className="text-xl font-bold">4</span>
                            <span className="text-gray-700 text-sm">Followers</span>
                        </span>
                        <span className="flex flex-col items-center">
                            <span className="text-xl font-bold">10</span>
                            <span className="text-gray-700 text-sm">Following</span>
                        </span>
                        <span className="flex flex-col items-center">
                            <span className="text-xl font-bold">1000</span>
                            <span className="text-gray-700 text-sm">Likes</span>
                        </span>
                    </div>
                </div>
                <p className='capitalize text-sm text-gray-700'>{user?.bio}</p>

                <Link to={'/edit'}>
                    <button className="w-full cursor-pointer bg-gray-200 p-2 rounded-2xl hover:bg-gray-300 transition duration-150">
                        Edit Profile
                    </button>
                </Link>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <div className="flex justify-start">
                        {tabs.map((tab) => (
                            <button
                                key={tab.name}
                                onClick={() => setActiveTab(tab.name)}
                                className={`py-3 px-4 text-center font-medium transition-colors duration-200 ${
                                    activeTab === tab.name
                                        ? 'border-b-2 border-orange-500 text-orange-500'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {tab.name} ({tab.count})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="pt-8">{renderContent()}</div>
            </div>
        </div>
    );
}

export default Profile;
