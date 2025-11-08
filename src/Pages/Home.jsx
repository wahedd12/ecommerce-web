import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { products } from "../Data/products";
import Product from "../Pages/Product";
import { useUser } from "../Context/userContext";
import { useCart } from "../Context/cartContext";
import { Eye, EyeOff } from "lucide-react"; // 👁️ for toggling password visibility

export default function Home() {
  const { user, signup, login, logout } = useUser();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const [signupData, setSignupData] = useState({ name: "", email: "", password: "" });
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    await signup(signupData.name, signupData.email, signupData.password);
    setShowSignup(false);
    setSignupData({ name: "", email: "", password: "" });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(loginData.email, loginData.password);
    setShowLogin(false);
    setLoginData({ email: "", password: "" });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar
        user={user}
        onShowSignup={() => setShowSignup(true)}
        onShowLogin={() => setShowLogin(true)}
        onLogout={logout}
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-24 px-6 text-center rounded-md mb-16">
        <h1 className="text-5xl font-extrabold mb-4">Welcome to Waspomind</h1>
        <p className="text-lg max-w-2xl mx-auto mb-8">
          Explore books, and all digital publications on culture, religion, psychology and humanity — delivered directly to readers worldwide.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            to="/products"
            className="bg-yellow-400 text-blue-700 px-6 py-3 rounded font-semibold hover:bg-yellow-300 transition"
          >
            Explore Products
          </Link>
          <Link
            to="/about"
            className="bg-white text-blue-600 px-6 py-3 rounded font-semibold hover:bg-gray-100 transition"
          >
            About Waspomind
          </Link>
        </div>
      </div>

      {/* Signup Modal */}
      {showSignup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-96 relative">
            <button
              className="absolute top-2 right-2 text-gray-600"
              onClick={() => setShowSignup(false)}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
            <form onSubmit={handleSignup} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Name"
                value={signupData.name}
                onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                className="border px-4 py-2 rounded"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                className="border px-4 py-2 rounded"
                required
              />
              <div className="relative">
                <input
                  type={showSignupPassword ? "text" : "password"}
                  placeholder="Password (8–12 chars)"
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  className="border px-4 py-2 rounded w-full"
                  pattern="(?=.*[A-Z]).{8,12}"
                  title="Password must be 8–12 characters and include at least 1 uppercase letter"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-600"
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                >
                  {showSignupPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 rounded hover:bg-blue-500 transition"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-96 relative">
            <button
              className="absolute top-2 right-2 text-gray-600"
              onClick={() => setShowLogin(false)}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className="border px-4 py-2 rounded"
                required
              />
              <div className="relative">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  placeholder="Password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="border px-4 py-2 rounded w-full"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-600"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                >
                  {showLoginPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* ✅ Forgot password link */}
              <Link
                to="/forgot-password"
                onClick={() => setShowLogin(false)}
                className="text-sm text-blue-600 hover:underline text-right"
              >
                Forgot Password?
              </Link>

              <button
                type="submit"
                className="bg-green-600 text-white py-2 rounded hover:bg-green-500 transition"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Product Grid */}
      <main className="px-6 pb-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <Product
            key={product.id}
            product={product}
            showSummary={false}
            onAddToCart={() => addToCart(product, 1)}
          />
        ))}
      </main>

      <Footer />
    </div>
  );
}
