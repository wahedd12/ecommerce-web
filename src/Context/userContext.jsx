import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  useEffect(() => {
    if (token && user) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, [token, user]);

  // Password validation function
  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z]).{8,12}$/;
    return regex.test(password);
  };

  // Signup function
  const signup = async (name, email, password) => {
    if (!validatePassword(password)) {
      alert(
        "Password must be 8–12 characters and include at least 1 uppercase letter."
      );
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/signup", {
        name,
        email,
        password,
      });

      setUser({ name: res.data.name, email: res.data.email });
      setToken(res.data.token);
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      setUser({ name: res.data.name, email: res.data.email });
      setToken(res.data.token);
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, token, signup, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
