import React, { useState } from "react";
import axios from "axios";
import { useSearchParams, Link } from "react-router-dom";
import { API_URL } from "../Config/api";
import { Eye, EyeOff, Lock } from "lucide-react";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`${API_URL}/reset-password`, {
        token,
        newPassword,
      });
      setMessage(res.data.message || "Password reset successful! You can now log in.");
    } catch (err) {
      setMessage("Failed to reset password. Link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <form
        onSubmit={handleReset}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">
          Reset Password
        </h2>

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            className="border w-full p-2 rounded"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <span
            className="absolute right-3 top-3 cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
          <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 w-full text-white py-2 rounded hover:bg-green-500 transition disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset Password"}
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
