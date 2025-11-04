import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6 mt-12">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} Waspomind. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Link to="/about" className="hover:text-yellow-300 transition text-sm">About</Link>
          <Link to="/contact" className="hover:text-yellow-300 transition text-sm">Contact</Link>
          <a href="#" className="hover:text-yellow-300 transition text-sm">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}
