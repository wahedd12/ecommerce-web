import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../Config/api";
import { useUser } from "../Context/userContext";

export default function Navbar({ user, onShowSignup, onShowLogin, onLogout }) {
  const { token, logout } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/delete-account`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Account deleted successfully.");
      logout();
    } catch (err) {
      console.error("Delete account error:", err);
      alert(err.response?.data?.message || "Failed to delete account.");
    }
  };

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      {/* Logo */}
      <div className="text-2xl font-bold">
        <Link to="/" className="hover:text-yellow-300 transition">
          Waspomind
        </Link>
      </div>

      {/* Menu Links */}
      <div className="hidden md:flex items-center gap-6">
        <Link to="/" className="hover:text-yellow-300 transition font-medium">
          Home
        </Link>
        <Link
          to="/products"
          className="hover:text-yellow-300 transition font-medium"
        >
          Products
        </Link>
        <Link
          to="/about"
          className="hover:text-yellow-300 transition font-medium"
        >
          About
        </Link>
        <Link
          to="/contact"
          className="hover:text-yellow-300 transition font-medium"
        >
          Contact
        </Link>
      </div>

      {/* Auth Buttons */}
      <div className="flex items-center gap-4 relative" ref={dropdownRef}>
        {user ? (
          <>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-1 font-semibold hover:text-yellow-300 transition"
            >
              Hi, {user.name} ▼
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-12 bg-white text-gray-800 rounded shadow-lg w-48 z-50">
                <button
                  onClick={onLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  Delete Account
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <button
              onClick={onShowLogin}
              className="bg-green-500 px-3 py-1 rounded hover:bg-green-400 transition"
            >
              Login
            </button>
            <button
              onClick={onShowSignup}
              className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100 transition"
            >
              Sign Up
            </button>
          </>
        )}
      </div>

      {/* Mobile Menu Placeholder */}
      {/* You can add a hamburger menu for small screens here */}
    </nav>
  );
}
