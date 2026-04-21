"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface CashierOrderItem {
  name: string;
  price: string;
  quantity: number;
  customizations?: string[];
}

export interface CashierTableOrder {
  orderId: string;
  tableId: string;
  tableLabel: string;
  items: CashierOrderItem[];
  totalPrice: number;
  timestamp: Date;
  status: "pending" | "in_progress" | "completed";
}

export interface PaidOrder extends CashierTableOrder {
  paidAt: Date;
  paymentMethod?: string;
  paymentSessionId: string;
  firstOrderTime: Date;
}

interface CashierOrdersContextType {
  orders: CashierTableOrder[];
  paidOrders: PaidOrder[];
  addOrder: (order: Omit<CashierTableOrder, "timestamp" | "orderId">) => void;
  updateOrderStatus: (orderId: string, status: CashierTableOrder["status"]) => void;
  removeOrder: (orderId: string) => void;
  clearCompletedOrders: () => void;
  processPaidOrders: (orderIds: string[]) => void;
  clearPaidOrders: () => void;
  changeTableForOrders: (fromTableId: string, toTableId: string, toTableLabel: string) => void;
}

const CashierOrdersContext = createContext<CashierOrdersContextType | undefined>(undefined);

export function CashierOrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<CashierTableOrder[]>([]);
  const [paidOrders, setPaidOrders] = useState<PaidOrder[]>([]);
  const [tableFirstOrderTimes, setTableFirstOrderTimes] = useState<Record<string, Date>>({});

  const generateOrderId = (): string => {
    return `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const generatePaymentSessionId = (): string => {
    return `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const addOrder = (order: Omit<CashierTableOrder, "timestamp" | "orderId">) => {
    const newOrder: CashierTableOrder = {
      ...order,
      orderId: generateOrderId(),
      timestamp: new Date(),
      status: "pending" as const,
    };
    
    // Track first order time for this table if not already tracked
    setTableFirstOrderTimes((prev) => {
      if (!prev[order.tableId]) {
        return {
          ...prev,
          [order.tableId]: new Date(),
        };
      }
      return prev;
    });
    
    setOrders((prev) => [...prev, newOrder]);
  };

  const updateOrderStatus = (orderId: string, status: CashierTableOrder["status"]) => {
    setOrders((prev) =>
      prev.map((order) => (order.orderId === orderId ? { ...order, status } : order))
    );
  };

  const removeOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((order) => order.orderId !== orderId));
  };

  const clearCompletedOrders = () => {
    setOrders((prev) => prev.filter((order) => order.status !== "completed"));
  };

  const processPaidOrders = (orderIds: string[]) => {
    const paymentSessionId = generatePaymentSessionId();
    const ordersToMove = orders.filter((o) => orderIds.includes(o.orderId));
    
    if (ordersToMove.length > 0) {
      setPaidOrders((prev) => [
        ...ordersToMove.map((order) => ({
          ...order,
          paidAt: new Date(),
          paymentMethod: "QR Payment",
          paymentSessionId,
          firstOrderTime: tableFirstOrderTimes[order.tableId] || new Date(),
        })),
        ...prev,
      ]);
      // Remove paid orders from active orders
      ordersToMove.forEach((order) => removeOrder(order.orderId));
    }
  };

  const clearPaidOrders = () => {
    setPaidOrders([]);
  };

  const changeTableForOrders = (fromTableId: string, toTableId: string, toTableLabel: string) => {
    // Update all orders from the old table to the new table
    setOrders((prev) =>
      prev.map((order) =>
        order.tableId === fromTableId
          ? { ...order, tableId: toTableId, tableLabel: toTableLabel }
          : order
      )
    );
    
    // Update first order time mapping
    setTableFirstOrderTimes((prev) => {
      const fromTableFirstTime = prev[fromTableId];
      if (fromTableFirstTime) {
        return {
          ...prev,
          [toTableId]: fromTableFirstTime,
          [fromTableId]: undefined,
        };
      }
      return prev;
    });
  };

  return (
    <CashierOrdersContext.Provider
      value={{
        orders,
        paidOrders,
        addOrder,
        updateOrderStatus,
        removeOrder,
        clearCompletedOrders,
        processPaidOrders,
        clearPaidOrders,
        changeTableForOrders,
      }}
    >
      {children}
    </CashierOrdersContext.Provider>
  );
}

export function useCashierOrders() {
  const context = useContext(CashierOrdersContext);
  if (!context) {
    throw new Error("useCashierOrders must be used within CashierOrdersProvider");
  }
  return context;
}
