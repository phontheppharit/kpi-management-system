import React from "react";
import { User, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Layout({ children }) {
  const navigate = useNavigate();

  // ✅ ดึง user จาก localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const username = storedUser?.username;
  const role = storedUser?.role || "user";
  const isAdmin = role === "Admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* 🔹 Navbar */}
      <nav className="bg-white shadow px-6 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-700">KPI Management</h1>

        {/* Menu Links */}
        <div className="flex gap-4">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `font-medium ${
                isActive ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"
              }`
            }
          >
            Dashboard
          </NavLink>

          {/* ✅ Admin only */}
          {isAdmin && (
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `font-medium ${
                  isActive ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"
                }`
              }
            >
              User Management
            </NavLink>
          )}

          {isAdmin && (
            <NavLink
              to="/kpimanage"
              className={({ isActive }) =>
                `font-medium ${
                  isActive ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"
                }`
              }
            >
              KPI Management
            </NavLink>
          )}

          {!isAdmin && (
            <NavLink
              to="/my-kpis"
              className={({ isActive }) =>
                `font-medium ${
                  isActive ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"
                }`
              }
            >
              MyKPI
            </NavLink>
          )}
        </div>

        {/* User + Logout */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <User className="w-6 h-6" />
            <span className="hidden sm:inline">{username}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </nav>

      {/* 🔹 Main Content */}
      <main className="flex-1 p-6 space-y-6">{children}</main>
    </div>
  );
}
