import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useUser } from "../Context/userContext";

export default function About() {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} />

      <main className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">About Us</h1>
        <p>
          Waspomind is a platform created by Akinrele Waheed Olamiposi, blending technology and literature
          to bring books and digital publications directly to readers worldwide. Focused on culture,
          religion, and humanity, Waspomind empowers readers to access thought-provoking works
          without geographical barriers.
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
        >
          Back to Home
        </button>
      </main>

      <Footer />
    </div>
  );
}
