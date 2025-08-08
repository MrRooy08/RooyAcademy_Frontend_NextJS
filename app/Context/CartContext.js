"use client";
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("cartItems")) || [];
      setCartItems(stored);
    } catch (err) {
      console.error("Failed to parse cartItems from localStorage", err);
    }
  }, []);

  useEffect(() => {
    const handleClear = () => setCartItems([]);
    window.addEventListener("cart_cleared", handleClear);
    return () => window.removeEventListener("cart_cleared", handleClear);
  }, []);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // add course to cart (avoid duplicates)
  const addItem = (course) => {
    setCartItems((prev) => {
      if (prev.find((c) => c.id === course.id)) return prev;
      return [...prev, course];
    });
  };

  // remove a course
  const removeItem = (courseId) => {
    setCartItems((prev) => prev.filter((c) => c.id !== courseId));
  };

  // clear all
  const clearCart = () => setCartItems([]);

  const value = {
    cartItems,
    setCartItems,
    cartCount: cartItems.length,
    addItem,
    removeItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
