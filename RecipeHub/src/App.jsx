import { Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import SignUp from "./pages/SignUp";
import UserAuth from "./pages/UserAuth";
import { Toaster } from "react-hot-toast";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import RecipeForm from "./pages/AddRecipe";
import RecipyDetails from "./pages/RecipyDetails";
import HomePage from "./pages/HomePage";
import MyFeed from "./pages/MyFeed";
import AddRecipePage from "./pages/AddRecipePage";
import EditRecipePage from "./pages/EditRecipePage";
import { AuthContext } from "./context/AuthContext";
import { useContext, useEffect } from "react";
import { socket } from "./socket";
import Search from "./pages/Search";

function App() {

  const {user}=useContext(AuthContext)

   useEffect(() => {
    if (user?._id) {
      socket.connect();
      socket.emit('register', user._id);

      // Optional: clean up
      return () => {
        socket.disconnect();
      };
    }
  }, [user?._id]);

  return (
    <>
    <Toaster />
    <Routes>

      {/* Layout wrapper */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage/>} />
        <Route path="recipes" element={<>recipes</>} />
        <Route path="settings" element={<>settings</>} />
           <Route path="profile/:id" element={<Profile/>} />
            <Route path="Edit" element={<EditProfile/>} />
                        <Route path="feed" element={<MyFeed/>} />

            <Route path="create-recipe" element={<AddRecipePage/>} />
            <Route path="recipedetails/:id" element={<RecipyDetails/>} />
            <Route path="edit/:id" element={<EditRecipePage/>} />
            <Route path="search/:q" element={<Search/>} />
            <Route path="/*" element={<>not found</>}/>



     
      </Route>
              <Route path="/signup" element={<UserAuth/>} />

    </Routes>
    </>
  );
}

export default App;
