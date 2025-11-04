import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useUser } from "../Context/userContext";

export default function Contact() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for reaching out! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} />

      <main className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Your Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border px-4 py-2 rounded"
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border px-4 py-2 rounded"
            required
          />
          <textarea
            placeholder="Your Message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="border px-4 py-2 rounded"
            rows={5}
            required
          ></textarea>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
          >
            Send Message
          </button>
        </form>

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
