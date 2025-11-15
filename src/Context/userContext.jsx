import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

  useEffect(() => {
    if (token && user) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, [token, user]);

  // ✅ Use environment variable for backend URL
  const API_URL = import.meta.env.VITE_API_URL;

  // 🔹 SIGNUP
  const signup = async (name, email, password) => {
    try {
      const res = await axios.post(
        `${API_URL}/signup`,
        { name, email, password },
        { withCredentials: true } // optional if you want cookies later
      );

      setUser({ name: res.data.name, email: res.data.email });
      setToken(res.data.token);
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
      throw err;
    }
  };

  // 🔹 LOGIN
  const login = async (email, password) => {
    try {
      const res = await axios.post(
        `${API_URL}/login`,
        { email, password },
        { withCredentials: true }
      );
      setUser({ name: res.data.name, email: res.data.email });
      setToken(res.data.token);
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
      throw err;
    }
  };

  // 🔹 LOGOUT
  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // 🔹 OPTIONAL: Forgot/Reset/Delete account functions remain unchanged
  const forgotPassword = async (email) => {
    try {
      const res = await axios.post(`${API_URL}/forgot-password`, { email });
      alert(res.data.message || "Password reset link sent! Check your email.");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send reset link.");
      throw err;
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      const res = await axios.post(`${API_URL}/reset-password`, { token, newPassword });
      alert(res.data.message || "Password reset successful! You can now log in.");
    } catch (err) {
      alert(err.response?.data?.message || "Password reset failed.");
      throw err;
    }
  };

  const deleteAccount = async () => {
    if (!window.confirm("Are you sure you want to permanently delete your account?")) return;

    try {
      await axios.delete(`${API_URL}/delete-account`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Your account has been deleted.");
      logout();
    } catch (err) {
      alert(err.response?.data?.message || "Account deletion failed.");
      throw err;
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        signup,
        login,
        logout,
        forgotPassword,
        resetPassword,
        deleteAccount,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
