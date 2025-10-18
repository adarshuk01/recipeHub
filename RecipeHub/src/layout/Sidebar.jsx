import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { RiMenuFold2Fill, RiMenuFoldFill } from "react-icons/ri";
import { FaCrown, FaRegBell, FaBell } from "react-icons/fa";
import { IoTrophySharp } from "react-icons/io5";
import { BiBookContent } from "react-icons/bi";
import { BsFillFilePostFill, BsBookmark, BsCheck2, BsGlobe } from "react-icons/bs";
import { IoIosStats } from "react-icons/io";
import { HiOutlineClipboardList } from "react-icons/hi";
import { MdCollectionsBookmark } from "react-icons/md";


const menuItems = [
  { id: 1, label: "Search", icon: <FiSearch size={26} />, to: "/" },
  { id: 2, label: "Premium", icon: <FaCrown size={26} />, to: "/premium" },
  { id: 3, label: "Feed", icon: <BsFillFilePostFill size={26} />, to: "/feed" },
  { id: 4, label: "Recipe Stats", icon: <IoIosStats size={26} />, to: "/stats" },
  { id: 5, label: "Challenges", icon: <IoTrophySharp size={26} />, to: "/challenges" },
  { id: 6, label: "Activity", icon: <FaBell size={26} />, to: "/activity" },
  {
    id: 7,
    label: "Your Collection",
    icon: <MdCollectionsBookmark size={26} />,
    to: "/collection",
    children: [
      { id: "c1", label: "All", icon: <HiOutlineClipboardList size={20} />, count: 1, to: "/collection/all" },
      { id: "c2", label: "Saved", icon: <BsBookmark size={20} />, count: 0, to: "/collection/saved" },
      { id: "c3", label: "Cooked", icon: <BsCheck2 size={20} />, count: 0, to: "/collection/cooked" },
      { id: "c4", label: "Your recipes", icon: <BiBookContent size={20} />, count: 1, to: "/collection/your-recipes" },
      { id: "c5", label: "Published", icon: <BsGlobe size={20} />, count: 0, to: "/collection/published" },
    ],
  },
];

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const location = useLocation();

const isActive = (path) => {
  if (path === "/") {
    return location.pathname === "/";
  }
  return location.pathname.startsWith(path);
};

  return (
    <div
      className={`h-[97vh] bg-white relative p-5 flex-col transition-all shadow-md duration-300 hidden lg:flex z-50 ${
        collapsed ? "w-20" : "w-60"
      }`}
    >
      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-1 absolute -right-14 text-center top-3 rounded-md hover:bg-gray-100"
      >
        {collapsed ? (
          <RiMenuFold2Fill color="gray" size={30} />
        ) : (
          <RiMenuFoldFill color="gray" size={30} />
        )}
      </button>

      {/* Header */}
      <Link to="/" className="flex items-center flex-col justify-center mb-4">
        <div className="flex items-center gap-2">
          <img width={150} src="/logo3-m.png" alt="logo" />
        </div>
        {!collapsed && (
          <h2 className="pacifico-regular text-xl lg:text-2xl -mt-3">
            Recipe<span className="text-orange-500 pacifico-regular">Hub</span>
          </h2>
        )}
      </Link>

      {/* Menu */}
      <nav className="flex flex-col gap-6 text-gray-600 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.id}>
            {/* Parent Menu */}
            {item.children ? (
              <button
                onClick={() => setCollectionOpen(!collectionOpen)}
                className={`w-full text-left flex items-center cursor-pointer ${
                  collapsed ? "justify-center" : "gap-3"
                } ${isActive(item.to) ? "text-orange-500" : "hover:text-orange-400"}`}
              >
                {item.icon}
                {!collapsed && <span className="text-lg">{item.label}</span>}
              </button>
            ) : (
              <Link
                to={item.to}
                className={`flex items-center ${
                  collapsed ? "justify-center" : "gap-3"
                } ${isActive(item.to) ? "text-orange-500" : "hover:text-orange-400"}`}
              >
                {item.icon}
                {!collapsed && <span className="text-lg">{item.label}</span>}
              </Link>
            )}

            {/* Child Menu */}
            {!collapsed && item.children && collectionOpen && (
              <div className="ml-3 mt-3 flex flex-col gap-3 text-gray-600">
                {item.children.map((sub) => (
                  <Link
                    key={sub.id}
                    to={sub.to}
                    className={`flex items-center gap-2 hover:text-orange-400 ${
                      isActive(sub.to) ? "text-orange-500" : ""
                    }`}
                  >
                    <span className="bg-gray-100 rounded p-3">{sub.icon}</span>
                    <span className="flex flex-col">
                      <span className="text-lg">{sub.label}</span>
                      <span className="text-xs text-gray-400">
                        {sub.count} {sub.count === 1 ? "recipe" : "recipes"}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Login/Register */}
      {!collapsed && (
        <p className="text-sm text-gray-500 mt-6">
          To start creating your recipe library, please{" "}
          <Link to="/register" className="text-orange-500 underline">
            register
          </Link>{" "}
          or{" "}
          <Link to="/login" className="text-orange-500 underline">
            login
          </Link>
          .
        </p>
      )}
    </div>
  );
}

export default Sidebar;
