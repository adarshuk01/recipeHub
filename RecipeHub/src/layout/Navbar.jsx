import React, { useContext, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import {
  FiUser,
  FiSettings,
  FiLogOut,
  FiSend,
  FiBell,
} from "react-icons/fi";
import axiosInstance from "../axiosInstance";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { notifications, setNotifications ,fetchNotifications} = useNotifications();
  console.log('notifications',notifications);
  

  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const prevNotifOpenRef = useRef(notifOpen);

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target)
      ) {
        setNotifOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Track closing of dropdown
  useEffect(() => {
    if (prevNotifOpenRef.current && !notifOpen) {
      markNotificationsAsRead();
    }
    prevNotifOpenRef.current = notifOpen;
  }, [notifOpen]);

  const markNotificationsAsRead = async () => {
    try {
      await axiosInstance.put('/notification/mark-as-read');
      const updated = notifications.map(n => ({ ...n, read: true }));
      setNotifications(updated);
    } catch (err) {
      console.error("Failed to mark notifications as read", err);
    }
  };

  const handleBellClick = () => {
    setNotifOpen(!notifOpen);
  };

  return (
    <div className="w-full flex justify-between items-center px-4 py-2 shadow-md bg-white relative">
      {/* Logo - small screens */}
      <Link to={"/"} className="flex items-center lg:hidden">
        <img width={50} src="/logo3-m.png" alt="logo" />
        <h2 className="pacifico-regular text-2xl lg:text-4xl ml-2">
          Recipe<span className="text-orange-500 pacifico-regular ">Hub</span>
        </h2>
      </Link>
      <div>

      </div>

      <div className="flex items-center gap-4 relative">
        {user && (
          <div className="relative" ref={notifRef}>
            {/* 🔔 Notification Bell */}
            <button onClick={() => { setNotifOpen(!notifOpen), handleBellClick() }}>
              <FiBell className="text-2xl text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* 🔔 Notification Dropdown */}
            {notifOpen && (
              <div className="absolute -right-4 mt-2 w-72 bg-white shadow-lg rounded-xl p-3 z-50 max-h-72 overflow-y-auto">
                <h5 className="text-sm font-semibold text-gray-600 mb-2">
                  Notifications
                </h5>
                {notifications.length > 0 ? (
                  <ul className="space-y-1">
                    {notifications.slice(0, 10).map((notif, idx) => (
                      <li
                        key={idx}
                        className={`text-sm p-2 rounded border-b border-gray-300 ${notif.read ? 'bg-white' : 'bg-yellow-100'
                          } hover:bg-gray-100`}
                      >
                        {notif.type === 'follow' && notif.senderName && notif.senderId ? (
                          <>
                            <Link
                              to={`/profile/${notif.senderId}`}
                              className="font-semibold capitalize text-orange-500 hover:underline"
                            >
                              {notif.senderName}
                            </Link>
                            <span className="ml-1 text-gray-700">
                              started following you.
                            </span>
                          </>
                        ) : (
                          <span className="text-gray-700 capitalize">{notif.message}</span>
                        )}
                      </li>
                    ))}

                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">
                    No notifications yet.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Profile dropdown */}
        {user ? (
          <div className="relative" ref={profileRef}>
            {/* Avatar Button */}
            <button
              className="flex items-center"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <img
                className="w-10 h-10 border-2 border-orange-500 shadow-md rounded-full cursor-pointer"
                src={user.avatar || "/cheflogo.png"}
                alt="profile"
              />
            </button>

            {/* Profile Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-xl p-3 z-50">
                <div className="px-3 py-2">
                  <h4 className="font-semibold text-gray-800 capitalize">
                    {user.name || "User"}
                  </h4>
                  <p className="text-gray-500 text-sm">{user.email}</p>
                </div>

                {/* Links */}
                <ul className="py-2">
                  <li>
                    <Link
                      to={`/profile/${user._id}`}
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

                {/* Logout Button */}
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
          <Link to="/signup" className="border px-4 py-2 rounded-lg mr-2">
            Login/Register
          </Link>
        )}

        {/* Create Recipe Button */}
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
