import React, { useState } from "react";
import { PaystackButton } from "react-paystack";
import { useUser } from "../Context/userContext";
import { useCart } from "../Context/cartContext";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { user } = useUser();
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const totalAmount = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const publicKey = "pk_test_77dd0b5408bb0b896b387ce76065a97c82eb7498"; // Paystack key
  const [email] = useState(user?.email || "");
  const [amount] = useState(totalAmount * 100); // Paystack uses kobo

  const componentProps = {
    email,
    amount,
    metadata: { name: user?.name, cart },
    publicKey,
    text: "Pay Now",
    onSuccess: () => {
      alert("Payment successful! 🎉");
      clearCart();
      navigate("/");
    },
    onClose: () => alert("Payment closed ❌"),
  };

  if (!user)
    return (
      <div className="p-6 text-center">
        <p>Please login to proceed to checkout.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
        >
          Back to Home
        </button>
      </div>
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
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <div className="border p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between mb-2">
            <span>{item.name}</span>
            <span>
              #{Number(item.price).toFixed(2)} x {item.quantity} = #
              {(Number(item.price) * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
        <hr className="my-2" />
        <h3 className="text-xl font-semibold">Total: #{totalAmount.toFixed(2)}</h3>
        <div className="mt-4">
          <PaystackButton
            {...componentProps}
            className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-500"
          />
        </div>
      </div>
    </div>
  );
}
