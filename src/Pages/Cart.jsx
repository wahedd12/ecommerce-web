import React from "react";
import { useCart } from "../Context/cartContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleIncrease = (item) => updateQuantity(item.id, item.quantity + 1);

  const totalAmount = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  if (!cart.length)
    return (
      <div className="p-6 text-center">
        <p>Your cart is empty.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
        >
          Back to Home
        </button>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      {cart.map((item) => (
        <div
          key={item.id}
          className="flex justify-between items-center mb-4 border p-4 rounded shadow-sm hover:shadow-md transition"
        >
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-gray-600">Price: #{Number(item.price).toFixed(2)}</p>
            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={() => handleDecrease(item)}
                className="px-3 py-1 bg-gray-200 text-gray-800 font-bold rounded hover:bg-gray-300 transition"
              >
                -
              </button>
              <span className="px-2">{item.quantity}</span>
              <button
                onClick={() => handleIncrease(item)}
                className="px-3 py-1 bg-gray-200 text-gray-800 font-bold rounded hover:bg-gray-300 transition"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <p className="font-semibold">
              Subtotal: #{(Number(item.price) * item.quantity).toFixed(2)}
            </p>
            <button
              onClick={() => removeFromCart(item.id)}
              className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-500 transition font-semibold"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <hr className="my-4" />
      <h2 className="text-xl font-bold mb-4">Total: #{totalAmount.toFixed(2)}</h2>
      <div className="flex gap-4">
        <button
          onClick={clearCart}
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-500 transition font-semibold"
        >
          Clear Cart
        </button>
        <button
          onClick={() => navigate("/checkout")}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-500 transition font-semibold"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
