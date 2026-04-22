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
  customerName?: string;
}

interface CashierOrdersContextType {
  orders: CashierTableOrder[];
  paidOrders: PaidOrder[];
  addOrder: (order: Omit<CashierTableOrder, "timestamp" | "orderId">, customerName: string) => { success: boolean; error?: string };
  updateOrderStatus: (orderId: string, status: CashierTableOrder["status"]) => void;
  removeOrder: (orderId: string) => void;
  clearCompletedOrders: () => void;
  processPaidOrders: (orderIds: string[]) => void;
  clearPaidOrders: () => void;
  changeTableForOrders: (fromTableId: string, toTableId: string, toTableLabel: string) => void;
  registerTableName: (tableId: string, customerName: string) => { success: boolean; message: string };
  getTableName: (tableId: string) => string | undefined;
}

const CashierOrdersContext = createContext<CashierOrdersContextType | undefined>(undefined);

export function CashierOrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<CashierTableOrder[]>([]);
  const [paidOrders, setPaidOrders] = useState<PaidOrder[]>([]);
  const [tableFirstOrderTimes, setTableFirstOrderTimes] = useState<Record<string, Date>>({});
  const [tableCustomerNames, setTableCustomerNames] = useState<Record<string, string>>({});

  const generateOrderId = (): string => {
    return `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const generatePaymentSessionId = (): string => {
    return `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const addOrder = (order: Omit<CashierTableOrder, "timestamp" | "orderId">, customerName: string) => {
    // Validate table name
    if (tableCustomerNames[order.tableId] && tableCustomerNames[order.tableId] !== customerName) {
      return {
        success: false,
        error: `Meja ini atas nama "${tableCustomerNames[order.tableId]}", nama Anda tidak sesuai.`,
      };
    }

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

    // Register customer name for this table if not already registered
    setTableCustomerNames((prev) => {
      if (!prev[order.tableId]) {
        return {
          ...prev,
          [order.tableId]: customerName,
        };
      }
      return prev;
    });
    
    setOrders((prev) => [...prev, newOrder]);
    return { success: true };
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
      const tableIds = new Set(ordersToMove.map((o) => o.tableId));
      
      setPaidOrders((prev) => [
        ...ordersToMove.map((order) => ({
          ...order,
          paidAt: new Date(),
          paymentMethod: "QR Payment",
          paymentSessionId,
          firstOrderTime: tableFirstOrderTimes[order.tableId] || new Date(),
          customerName: tableCustomerNames[order.tableId],
        })),
        ...prev,
      ]);
      // Remove paid orders from active orders
      ordersToMove.forEach((order) => removeOrder(order.orderId));

      // Clear table customer name so it can be reused with a new customer
      setTableCustomerNames((prev) => {
        const updated = { ...prev };
        tableIds.forEach((tableId) => {
          delete updated[tableId];
        });
        return updated;
      });

      // Clear first order time for this table
      setTableFirstOrderTimes((prev) => {
        const updated = { ...prev };
        tableIds.forEach((tableId) => {
          delete updated[tableId];
        });
        return updated;
      });
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
        const updated = { ...prev };
        updated[toTableId] = fromTableFirstTime;
        delete updated[fromTableId];
        return updated;
      }
      return prev;
    });

    // Update customer name mapping
    setTableCustomerNames((prev) => {
      const fromTableName = prev[fromTableId];
      if (fromTableName) {
        const updated = { ...prev };
        updated[toTableId] = fromTableName;
        delete updated[fromTableId];
        return updated;
      }
      return prev;
    });
  };

  const registerTableName = (tableId: string, customerName: string) => {
    // Allow any name to be registered to a table at any time.
    // This facilitates friends joining a table or correcting typos easily.
    setTableCustomerNames((prev) => ({
      ...prev,
      [tableId]: customerName,
    }));

    return {
      success: true,
      message: `Oke, meja atas nama ${customerName}`,
    };
  };

  const getTableName = (tableId: string) => {
    return tableCustomerNames[tableId];
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
        registerTableName,
        getTableName,
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
