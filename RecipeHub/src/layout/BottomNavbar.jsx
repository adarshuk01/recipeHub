import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { FaCrown, FaBell } from "react-icons/fa";
import { IoTrophySharp } from "react-icons/io5";
import { BsFillFilePostFill, BsBookmark, BsCheck2, BsGlobe } from "react-icons/bs";
import { IoIosStats } from "react-icons/io";
import { MdCollectionsBookmark } from "react-icons/md";
import { HiOutlineClipboardList } from "react-icons/hi";
import { BiBookContent } from "react-icons/bi";

const menuItems = [
  { id: 1, label: "Search", icon: <FiSearch size={24} />, to: "/" },
  { id: 2, label: "Premium", icon: <FaCrown size={24} />, to: "/premium" },
  { id: 3, label: "Feed", icon: <BsFillFilePostFill size={24} />, to: "/feed" },
  { id: 5, label: "Challenges", icon: <IoTrophySharp size={24} />, to: "/challenges" },
  {
    id: 7,
    label: "Collection",
    icon: <MdCollectionsBookmark size={24} />,
    children: [
      { id: "c1", label: "All", icon: <HiOutlineClipboardList size={18} />, to: "/collection/all" },
      { id: "c2", label: "Saved", icon: <BsBookmark size={18} />, to: "/collection/saved" },
      { id: "c3", label: "Cooked", icon: <BsCheck2 size={18} />, to: "/collection/cooked" },
      { id: "c4", label: "Your Recipes", icon: <BiBookContent size={18} />, to: "/collection/your-recipes" },
      { id: "c5", label: "Published", icon: <BsGlobe size={18} />, to: "/collection/published" },
    ],
  },
];

export default function BottomNavbar() {
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);
  const [openCollection, setOpenCollection] = useState(false);

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <>
      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-lg flex justify-around items-center py-2 z-50 lg:hidden">
        {menuItems.map((item) => {
          if (item.children) {
            return (
              <button
                key={item.id}
                onClick={() => setOpenCollection(!openCollection)}
                className={`flex flex-col items-center text-sm transition-all ${
                  openCollection ? "text-orange-500 scale-105" : "text-gray-500 hover:text-orange-400"
                }`}
              >
                {item.icon}
                <span className="text-[11px] mt-1">{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.id}
              to={item.to}
              onClick={() => {
                setActivePath(item.to);
                setOpenCollection(false);
              }}
              className={`flex flex-col items-center text-sm transition-all ${
                isActive(item.to)
                  ? "text-orange-500 scale-105"
                  : "text-gray-500 hover:text-orange-400"
              }`}
            >
              {item.icon}
              <span className="text-[11px] mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Collection Popup */}
      {openCollection && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-lg border border-gray-200 p-3 w-[90%] max-w-sm z-50 transition-all">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-gray-700 text-sm">Your Collection</h3>
            <button
              onClick={() => setOpenCollection(false)}
              className="text-gray-400 text-xs hover:text-gray-600"
            >
              Close ✕
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {menuItems[4].children.map((child) => (
              <Link
                key={child.id}
                to={child.to}
                onClick={() => setOpenCollection(false)}
                className={`flex items-center gap-2 border rounded-xl px-3 py-2 hover:bg-orange-50 ${
                  isActive(child.to) ? "border-orange-400 text-orange-500" : "border-gray-200"
                }`}
              >
                <span>{child.icon}</span>
                <span className="text-sm">{child.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Overlay background (for closing popup) */}
      {openCollection && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpenCollection(false)}
        ></div>
      )}
    </>
  );
}
