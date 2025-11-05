import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Context/userContext";
import { useCart } from "../Context/cartContext";

export default function Product({ product, showSummary = true }) {
  const { user } = useUser();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!user) {
      alert("You need to log in to add items to your cart.");
      return;
    }

    // Add product with quantity = 1 by default
    addToCart(product, 1);

    const goToCart = window.confirm(
      `${product.name} has been added to your cart! Click OK to view your cart or Cancel to continue shopping.`
    );
    if (goToCart) navigate("/cart");
  };

  return (
    <div className="border rounded-lg shadow hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Product Image */}
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover rounded-t-lg"
      />

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-2 hover:text-blue-600 transition">
            {product.name}
          </h3>
          <p className="text-gray-600 font-medium mb-2">
            ₦{Number(product.price).toLocaleString()}
          </p>
          {showSummary && product.summary && (
            <p className="text-gray-500 text-sm mb-4">{product.summary}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition font-semibold"
          >
            Add to Cart
          </button>
          <button
            onClick={() => navigate(`/product/${product.id}`)}
            className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition font-semibold"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
}
