"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

/**
 * OrderContextType - Manages order-specific state (distinct from CartContext)
 * Handles customizations and order details for the Order page
 */
export interface OrderItemCustomization {
  id: string;
  label: string;
  value: string;
  price?: number;
}

export interface OrderItem {
  id: string; // Unique order item ID (not menu item name)
  menuItemName: string;
  menuItemPrice: string;
  quantity: number;
  customizations: OrderItemCustomization[];
  notes?: string;
}

interface OrderContextType {
  orderItems: OrderItem[];
  addOrderItem: (item: Omit<OrderItem, "id">) => void;
  updateOrderItem: (id: string, updates: Partial<OrderItem>) => void;
  removeOrderItem: (id: string) => void;
  clearOrder: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  qrToken?: string;
  setQRToken: (token: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

/**
 * OrderProvider - Wrapper for order state management
 * Use this in layout.tsx to make order context available throughout app
 */
export function OrderProvider({ children }: { children: ReactNode }) {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [qrToken, setQRToken] = useState<string | undefined>();

  /**
   * generateId - Create unique ID for order items
   * Format: itemName_timestamp_random
   */
  const generateId = (): string => {
    return `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  /**
   * parsePrice - Convert price string "29K" or "15K/17K" to number
   * Takes first price if multiple are present
   */
  const parsePrice = (priceStr: string): number => {
    const cleanStr = priceStr.split("/")[0].toUpperCase();
    const numeric = cleanStr.replace(/[^0-9]/g, "");
    return parseInt(numeric) * 1000 || 0;
  };

  /**
   * addOrderItem - Add new item to order with customizations
   */
  const addOrderItem = (item: Omit<OrderItem, "id">) => {
    const newItem: OrderItem = {
      ...item,
      id: generateId(),
    };
    setOrderItems((prev) => [...prev, newItem]);
  };

  /**
   * updateOrderItem - Update existing order item (quantity, customizations, notes)
   */
  const updateOrderItem = (id: string, updates: Partial<OrderItem>) => {
    setOrderItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  /**
   * removeOrderItem - Remove item from order by ID
   */
  const removeOrderItem = (id: string) => {
    setOrderItems((prev) => prev.filter((item) => item.id !== id));
  };

  /**
   * clearOrder - Clear all items from order
   */
  const clearOrder = () => {
    setOrderItems([]);
    setQRToken(undefined);
  };

  /**
   * getTotalItems - Get total quantity of all items in order
   */
  const getTotalItems = (): number => {
    return orderItems.reduce((acc, item) => acc + item.quantity, 0);
  };

  /**
   * getTotalPrice - Calculate total price including customizations
   */
  const getTotalPrice = (): number => {
    return orderItems.reduce((acc, item) => {
      const basePrice = parsePrice(item.menuItemPrice) * item.quantity;
      const customizationPrice = item.customizations.reduce(
        (customAcc, custom) => customAcc + (custom.price || 0),
        0
      );
      return acc + basePrice + customizationPrice * item.quantity;
    }, 0);
  };

  return (
    <OrderContext.Provider
      value={{
        orderItems,
        addOrderItem,
        updateOrderItem,
        removeOrderItem,
        clearOrder,
        getTotalItems,
        getTotalPrice,
        qrToken,
        setQRToken,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

/**
 * useOrder - Hook to access order context
 * Must be used within OrderProvider
 */
export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
}
