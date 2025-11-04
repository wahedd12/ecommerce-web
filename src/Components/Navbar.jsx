import React from "react";
import { Link } from "react-router-dom";

export default function Navbar({ user, onShowSignup, onShowLogin, onLogout }) {
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
        <Link to="/" className="hover:text-yellow-300 transition font-medium">Home</Link>
        <Link to="/products" className="hover:text-yellow-300 transition font-medium">Products</Link>
        <Link to="/about" className="hover:text-yellow-300 transition font-medium">About</Link>
        <Link to="/contact" className="hover:text-yellow-300 transition font-medium">Contact</Link>
      </div>

      {/* Auth Buttons */}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="font-semibold">Welcome, {user.name}!</span>
            <button
              onClick={onLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-400 transition"
            >
              Logout
            </button>
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
