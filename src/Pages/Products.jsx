import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { products } from "../Data/products";
import { useUser } from "../Context/userContext";
import Product from "./Product"; // Product component handles add-to-cart

export default function Products() {
  const { user } = useUser();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} />

      {/* Hero Section for Products */}
      <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white py-16 px-6 text-center rounded-md mb-8">
        <h1 className="text-4xl font-bold mb-2">Explore Our Products</h1>
        <p className="text-lg max-w-2xl mx-auto">
          Discover your favorite books and digital publications on culture, religion, and humanity.
        </p>
      </div>

      {/* Product Grid */}
      <main className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 flex-grow">
        {products.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </main>

      <Footer />
    </div>
  );
}
