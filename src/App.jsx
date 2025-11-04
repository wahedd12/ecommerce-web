import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Products from "./Pages/Products";
import ProductDetails from "./Pages/ProductDetails";
import Cart from "./Pages/Cart";
import { CartProvider } from "./Context/cartContext";
import { UserProvider } from "./Context/userContext";
import Checkout from "./Pages/Checkout";
import Contact from "./Pages/Contact";
import About from "./Pages/About";

export default function App() {
  return (
    <UserProvider>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/cart" element={<Cart />} />
           <Route path="/about" element={<About />} />
  <Route path="/contact" element={<Contact />} />
        </Routes>
      </CartProvider>
    </UserProvider>
  );
}
