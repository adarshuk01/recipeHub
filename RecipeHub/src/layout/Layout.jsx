import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import BottomNavbar from "./BottomNavbar";

function Layout() {
  return (
    <div className="bg-gray-100 h-screen flex gap-2 p-2">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Section */}
      <div className="flex flex-col flex-1">
        <Navbar />

        {/* Main Content */}
        <main
          className="
            flex-1 
            p-2 
            lg:p-6 
            bg-gray-100 
            overflow-y-auto 
            pb-20  /* ✅ add bottom padding to avoid overlap */
          "
        >
          <Outlet />
        </main>

        {/* Bottom Navbar (mobile only) */}
        <BottomNavbar />
      </div>
    </div>
  );
}

export default Layout;
