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

function App() {
  return (
    <>
    <Toaster />
    <Routes>

      {/* Layout wrapper */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage/>} />
        <Route path="recipes" element={<>recipes</>} />
        <Route path="settings" element={<>settings</>} />
           <Route path="profile" element={<Profile/>} />
            <Route path="Edit" element={<EditProfile/>} />
            <Route path="create-recipe" element={<RecipeForm/>} />
            <Route path="recipedetails/:id" element={<RecipyDetails/>} />



     
      </Route>
              <Route path="/signup" element={<UserAuth/>} />

    </Routes>
    </>
  );
}

export default App;
