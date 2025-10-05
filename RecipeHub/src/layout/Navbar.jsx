// Navbar.jsx
import React, { useContext, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FiUser, FiSettings, FiLogOut, FiSend } from "react-icons/fi";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full flex justify-between items-center px-4 py-2 shadow-md bg-white relative">
      <div className="hidden lg:block"></div>

      {/* Logo for small screens */}
      <Link to={'/'} className="flex items-center lg:hidden">
        <Link to={'/'}>
        <img width={50} src="/public/logo3-m.png" alt="logo" />
        </Link>
        <h2 className="pacifico-regular text-2xl lg:text-4xl">
          Recipe<span className="text-orange-500 pacifico-regular">Hub</span>
        </h2>
      </Link>

      <div className="flex items-center gap-2 relative">
        {user ? (
          <div className="relative" ref={dropdownRef}>
            {/* Profile Avatar */}
            <button
              className="flex items-center"
              onClick={() => setOpen(!open)}
            >
              <img
                className="w-10 border-2 border-orange-500 shadow-md h-10 rounded-full cursor-pointer"
                src={user.avatar ? user.avatar : "/public/cheflogo.png"}
                alt="profile"
              />
            </button>

            {/* Dropdown */}
            {open && (
              <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-xl p-3 z-50">
                <div className="px-3 py-2">
                  <h4 className="font-semibold text-gray-800 capitalize">
                    {user.name || "User"}
                  </h4>
                  <p className="text-gray-500 text-sm">{user.email}</p>
                </div> 

                <ul className="py-2">
                  <li>         
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg"
                    >
                      <FiUser /> Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/settings"
                      className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg"
                    >
                      <FiSettings /> Settings
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/feedback"
                      className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg"
                    >
                      <FiSend /> Send Feedback
                    </Link>
                  </li>
                </ul>

                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-3 py-2 w-full text-left text-red-500 hover:bg-gray-100 rounded-lg"
                >
                  <FiLogOut /> Log out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/signup"
            className="border px-4 py-2 rounded-lg mr-2"
          >
            Login/Register
          </Link>
        )}

        <Link
          to="/create-recipe"
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hidden lg:inline"
        >
          + Create a recipe
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
