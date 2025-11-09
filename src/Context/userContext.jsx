import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../Config/api";


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

  // 🔹 SIGNUP
  const signup = async (name, email, password) => {
    try {
      const res = await axios.post(`${API_URL}/signup`, { name, email, password });
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
      const res = await axios.post(`${API_URL}/login`, { email, password });
      setUser({ name: res.data.name, email: res.data.email });
      setToken(res.data.token);
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
      throw err;
    }
  };

  // 🔹 FORGOT PASSWORD
  const forgotPassword = async (email) => {
    try {
      const res = await axios.post(`${API_URL}/forgot-password`, { email });
      alert(res.data.message || "Password reset link sent! Check your email.");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send reset link.");
      throw err;
    }
  };

  // 🔹 RESET PASSWORD
  const resetPassword = async (token, newPassword) => {
    try {
      const res = await axios.post(`${API_URL}/reset-password`, { token, newPassword });
      alert(res.data.message || "Password reset successful! You can now log in.");
    } catch (err) {
      alert(err.response?.data?.message || "Password reset failed.");
      throw err;
    }
  };

  // 🔹 DELETE ACCOUNT
  const deleteAccount = async () => {
    if (!window.confirm("Are you sure you want to permanently delete your account? This cannot be undone.")) {
      return;
    }

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

  // 🔹 LOGOUT
  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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
