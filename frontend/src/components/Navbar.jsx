import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <div className="bg-white shadow-md px-6 py-3 flex justify-between items-center sticky top-0 z-50">
      <div className="text-2xl font-bold text-blue-600">
        VaccineReminder
      </div>

      {user && (
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Dashboard
          </Link>

          <Link
            to="/profiles"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Profiles
          </Link>

          {/* ⭐ ADDING VACCINE LIBRARY LINK HERE BABY ⭐ */}
          <Link
            to="/library"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Vaccine Library
          </Link>

          <Link
            to="/vaccine-info"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            📚 Info Center
          </Link>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}