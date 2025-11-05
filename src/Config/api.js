// src/Config/api.js

    // src/Config/api.js
export const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://ecommerce-kf6inh0gw-wahedd12s-projects.vercel.app" // no /api at the end
    : "http://localhost:5000";

