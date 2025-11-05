import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../Config/api";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`${API_URL}/forgot-password`, { email });
      setMessage(res.data.message || "Password reset link sent! Check your inbox.");
    } catch (err) {
      setMessage("Error sending reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">
          Forgot Password
        </h2>

        <div className="relative mb-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="border w-full p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Mail className="absolute right-3 top-3 text-gray-400" size={20} />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 w-full text-white py-2 rounded hover:bg-blue-500 transition disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {message && <p className="text-sm text-center mt-3">{message}</p>}

        <p className="mt-3 text-center text-sm">
          <Link to="/login" className="text-blue-600 hover:underline">
            Back to Login
          </Link>
        </p>
      </form>
    </div>
  );
}
