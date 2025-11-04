import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { products } from "../Data/products";
import { useCart } from "../Context/cartContext";

export default function ProductDetails() {
  const { id } = useParams(); // get product id from URL
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // find the product by id (make sure id is number)
  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="p-6 text-center">
        <p>Product not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 flex flex-col md:flex-row gap-6">
      {/* Product image */}
      <img
        src={product.image}
        alt={product.name}
        className="w-full md:w-1/2 h-auto object-cover rounded"
      />

      {/* Product details */}
      <div className="flex-1 flex flex-col gap-4">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-xl font-semibold">₦{Number(product.price).toLocaleString()}</p>
        <p className="text-gray-700">{product.description}</p>

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => addToCart(product)}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-500"
          >
            Add to Cart
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
