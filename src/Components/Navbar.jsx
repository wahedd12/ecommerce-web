import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../Config/api";
import { useUser } from "../Context/userContext";

export default function Navbar({ user, onShowSignup, onShowLogin, onLogout }) {
  const { token, logout } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
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

  // Close dropdown or mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md relative">
      {/* Logo */}
      <div className="text-2xl font-bold">
        <Link to="/" className="hover:text-yellow-300 transition">
          Waspomind
        </Link>
      </div>

      {/* Desktop Menu Links */}
      <div className="hidden md:flex items-center gap-6">
        <Link to="/" className="hover:text-yellow-300 transition font-medium">
          Home
        </Link>
        <Link to="/products" className="hover:text-yellow-300 transition font-medium">
          Products
        </Link>
        <Link to="/about" className="hover:text-yellow-300 transition font-medium">
          About
        </Link>
        <Link to="/contact" className="hover:text-yellow-300 transition font-medium">
          Contact
        </Link>
      </div>

      {/* Desktop Auth Buttons */}
      <div className="hidden md:flex items-center gap-4 relative" ref={dropdownRef}>
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

      {/* Mobile Hamburger Button */}
      <button
        className="md:hidden text-white focus:outline-none"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {mobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className={`md:hidden absolute top-full left-0 w-full bg-blue-600 flex flex-col gap-2 px-4 py-4 z-40 overflow-y-auto transition-[max-height,opacity] duration-300 ease-in-out ${
          mobileMenuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {/* Links */}
        <Link to="/" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-yellow-300 transition">
          Home
        </Link>
        <Link
          to="/products"
          onClick={() => setMobileMenuOpen(false)}
          className="py-2 hover:text-yellow-300 transition"
        >
          Products
        </Link>
        <Link
          to="/about"
          onClick={() => setMobileMenuOpen(false)}
          className="py-2 hover:text-yellow-300 transition"
        >
          About
        </Link>
        <Link
          to="/contact"
          onClick={() => setMobileMenuOpen(false)}
          className="py-2 hover:text-yellow-300 transition"
        >
          Contact
        </Link>

        {/* Auth Buttons */}
        <div className="mt-2 border-t border-blue-400 pt-2 flex flex-col gap-2">
          {user ? (
            <>
              <span className="py-2 text-white font-semibold">Hi, {user.name}</span>
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
              <button
                onClick={() => {
                  handleDeleteAccount();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-1 bg-red-700 text-white rounded hover:bg-red-800 transition"
              >
                Delete Account
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  onShowLogin();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
              >
                Login
              </button>
              <button
                onClick={() => {
                  onShowSignup();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-1 bg-white text-blue-600 rounded hover:bg-gray-100 transition"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
