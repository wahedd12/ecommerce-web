import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "./userContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user, token } = useUser();

  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Add or update item in cart
  const addToCart = async (product, quantity = 1) => {
    if (!user) return;

    const productPrice = Number(product.price) || 0;

    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      const updatedCart = cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...product, quantity, price: productPrice }]);
    }

    // Sync with backend
    try {
      await axios.post(
        "http://localhost:5000/cart",
        { productId: product.id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Cart update failed:", err.response?.data || err.message);
    }
  };

  // Update quantity manually
  const updateQuantity = async (productId, quantity) => {
    const updatedCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );
    setCart(updatedCart);

    // Sync with backend
    if (!user) return;
    try {
      await axios.post(
        "http://localhost:5000/cart",
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Cart quantity update failed:", err.response?.data || err.message);
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    setCart(cart.filter((item) => item.id !== productId));

    if (!user) return;
    try {
      await axios.delete(`http://localhost:5000/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Cart removal failed:", err.response?.data || err.message);
    }
  };

  // Clear cart
  const clearCart = async () => {
    setCart([]);
    if (!user) return;
    try {
      for (const item of cart) {
        await axios.delete(`http://localhost:5000/cart/${item.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (err) {
      console.error("Cart clear failed:", err.response?.data || err.message);
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
