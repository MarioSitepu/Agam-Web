"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface CartItem {
  name: string;
  price: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: { name: string; price: string }) => void;
  removeItem: (name: string) => void;
  clearCart: () => void;
  totalCount: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Utility to parse "29K" or "15K/17K" to number 29000
  const parsePrice = (priceStr: string): number => {
    // If multiple prices (e.g. 15K/17K), we take the first one or normalize
    const cleanStr = priceStr.split('/')[0].toUpperCase();
    const numeric = cleanStr.replace(/[^0-9]/g, '');
    return parseInt(numeric) * 1000 || 0;
  };

  const addItem = (item: { name: string; price: string }) => {
    setItems((prev) => {
      const existingItem = prev.find((i) => i.name === item.name);
      if (existingItem) {
        return prev.map((i) =>
          i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (name: string) => {
    setItems((prev) => {
      const existingItem = prev.find((i) => i.name === name);
      if (existingItem && existingItem.quantity > 1) {
        return prev.map((i) =>
          i.name === name ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
      return prev.filter((i) => i.name !== name);
    });
  };

  const clearCart = () => setItems([]);

  const totalCount = items.reduce((acc, i) => acc + i.quantity, 0);
  const totalAmount = items.reduce(
    (acc, i) => acc + parsePrice(i.price) * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, clearCart, totalCount, totalAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
