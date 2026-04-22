"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AVAILABLE_TABLES } from "@/components/TableSelector";
import { ArrowLeft, Clock, AlertCircle, Check, X, ArrowRight, Search } from "lucide-react";
import { useCashierOrders } from "@/context/CashierOrdersContext";

export default function CashierDashboard() {
  // Get orders from context
  const { orders, paidOrders, updateOrderStatus, removeOrder, processPaidOrders, changeTableForOrders, getTableName } = useCashierOrders();

  const [activeTab, setActiveTab] = useState<"orders" | "history">("orders");
  const [paymentTableId, setPaymentTableId] = useState<string | null>(null);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [showChangeTableModal, setShowChangeTableModal] = useState(false);
  const [selectedTableIdForChange, setSelectedTableIdForChange] = useState<string | null>(null);
  const [showQuickPaymentModal, setShowQuickPaymentModal] = useState(false);
  const [quickPaymentSearch, setQuickPaymentSearch] = useState("");
  const [selectedQuickPaymentTableId, setSelectedQuickPaymentTableId] = useState<string | null>(null);

  // Group orders by tableId
  const groupedOrders = useMemo(() => {
    const grouped: Record<string, typeof orders> = {};
    orders.forEach((order) => {
      if (!grouped[order.tableId]) {
        grouped[order.tableId] = [];
      }
      grouped[order.tableId].push(order);
    });
    return grouped;
  }, [orders]);

  // Calculate statistics
  const stats = useMemo(
    () => ({
      totalOrders: Object.keys(groupedOrders).length,
      pendingOrders: orders.filter((o) => o.status === "pending").length,
      totalRevenue: orders.reduce((sum, order) => sum + order.totalPrice, 0),
    }),
    [groupedOrders, orders]
  );

  const handleStatusChange = (orderId: string, newStatus: "pending" | "in_progress" | "completed") => {
    updateOrderStatus(orderId, newStatus);
  };

  // Handle payment processing
  useEffect(() => {
    if (paymentTableId && !showPaymentSuccess) {
      const timer = setTimeout(() => {
        setShowPaymentSuccess(true);
        // Auto reset after success message
        setTimeout(() => {
          setShowPaymentSuccess(false);
          // Move all completed orders for this table to paid history with same payment session
          const tableOrders = groupedOrders[paymentTableId] || [];
          const completedOrderIds = tableOrders
            .filter((o) => o.status === "completed")
            .map((o) => o.orderId);
          if (completedOrderIds.length > 0) {
            processPaidOrders(completedOrderIds);
          }
          setPaymentTableId(null);
        }, 2000);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [paymentTableId, showPaymentSuccess, processPaidOrders, groupedOrders]);

  const handlePayment = (tableId: string) => {
    setPaymentTableId(tableId);
  };

  const handleQuickPayment = (tableId: string) => {
    setSelectedQuickPaymentTableId(null);
    setShowQuickPaymentModal(false);
    handlePayment(tableId);
  };

  const handleDeleteOrderInQuickPayment = (orderId: string) => {
    // Find the order to check its status
    const order = orders.find((o) => o.orderId === orderId);
    
    // Only allow deletion if order status is "pending"
    if (order && order.status === "pending") {
      removeOrder(orderId);
    }
  };

  // Get available tables (tables not in groupedOrders)
  const availableTables = useMemo(() => {
    const occupiedTableIds = Object.keys(groupedOrders);
    return AVAILABLE_TABLES.filter((table) => !occupiedTableIds.includes(table.id));
  }, [groupedOrders]);

  // Get tables ready for payment (all orders completed OR all orders pending)
  const tablesReadyForPayment = useMemo(() => {
    return Object.entries(groupedOrders)
      .map(([tableId, allTableOrders]) => {
        const completedOrders = allTableOrders.filter((o) => o.status === "completed");
        const pendingOrders = allTableOrders.filter((o) => o.status === "pending");
        const inProgressOrders = allTableOrders.filter((o) => o.status === "in_progress");
        
        // Table is ready for payment if:
        // 1. All orders are completed, OR
        // 2. All orders are pending (can be cancelled completely)
        // But NOT if there are any in_progress orders
        const isReadyForPayment =
          (allTableOrders.every((o) => o.status === "completed")) ||
          (allTableOrders.every((o) => o.status === "pending"));
        
        return {
          tableId,
          tableInfo: AVAILABLE_TABLES.find((t) => t.id === tableId),
          allOrders: allTableOrders,
          completedOrders,
          pendingOrders,
          inProgressOrders,
          customerName: getTableName(tableId),
          isReadyForPayment,
          canCancelAll: allTableOrders.every((o) => o.status === "pending"),
        };
      })
      .filter((item) => item.isReadyForPayment);
  }, [groupedOrders, getTableName]);

  // Filter tables for quick payment search
  const filteredQuickPaymentTables = useMemo(() => {
    if (!quickPaymentSearch.trim()) {
      return tablesReadyForPayment;
    }

    const searchLower = quickPaymentSearch.toLowerCase();
    return tablesReadyForPayment.filter(
      (item) =>
        item.tableInfo?.label.toLowerCase().includes(searchLower) ||
        item.tableInfo?.id.toLowerCase().includes(searchLower) ||
        (item.customerName && item.customerName.toLowerCase().includes(searchLower))
    );
  }, [tablesReadyForPayment, quickPaymentSearch]);

  const handleChangeTable = (fromTableId: string) => {
    setSelectedTableIdForChange(fromTableId);
    setShowChangeTableModal(true);
  };

  const handleConfirmTableChange = (newTableId: string) => {
    if (selectedTableIdForChange) {
      const newTableInfo = AVAILABLE_TABLES.find((t) => t.id === newTableId);
      if (newTableInfo) {
        changeTableForOrders(selectedTableIdForChange, newTableId, newTableInfo.label);
        setShowChangeTableModal(false);
        setSelectedTableIdForChange(null);
      }
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    if (minutes > 0) return `${minutes}m ago`;
    return `${seconds}s ago`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-red-50 border-red-200";
      case "in_progress":
        return "bg-yellow-50 border-yellow-200";
      case "completed":
        return "bg-green-50 border-green-200";
      default:
        return "bg-gray-50";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-red-100 text-red-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="pt-20 sm:pt-24 md:pt-28 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary-brown hover:text-primary-brown/80 font-bold mb-6 sm:mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>

          {/* Header */}
          <div className="mb-8 sm:mb-10">
            <h1 className="text-black font-script text-5xl sm:text-6xl md:text-7xl mb-2">Cashier</h1>
            <p className="text-gray-600 text-sm sm:text-base">Manage orders from all tables</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 sm:mb-10 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("orders")}
              className={`pb-4 font-bold text-lg transition-colors ${
                activeTab === "orders"
                  ? "text-primary-brown border-b-2 border-primary-brown"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              Active Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`pb-4 font-bold text-lg transition-colors ${
                activeTab === "history"
                  ? "text-primary-brown border-b-2 border-primary-brown"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              Order History ({paidOrders.length})
            </button>
          </div>

          {/* Quick Payment Button - Only on Orders tab */}
          {activeTab === "orders" && tablesReadyForPayment.length > 0 && (
            <div className="mb-8">
              <button
                onClick={() => {
                  setShowQuickPaymentModal(true);
                  setQuickPaymentSearch("");
                  setSelectedQuickPaymentTableId(null);
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center gap-2 shadow-md"
              >
                <span>⚡ Quick Payment</span>
                <span className="bg-green-700 px-2 py-0.5 rounded-full text-sm">{tablesReadyForPayment.length}</span>
              </button>
            </div>
          )}

          {/* Statistics Cards - Only show on Orders tab */}
          {activeTab === "orders" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <p className="text-gray-600 text-sm font-semibold mb-2">Active Tables</p>
                <p className="text-3xl sm:text-4xl font-bold text-black">{stats.totalOrders}</p>
                <p className="text-gray-500 text-sm mt-3">{AVAILABLE_TABLES.length - stats.totalOrders} tables available</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <p className="text-gray-600 text-sm font-semibold mb-2">Pending Orders</p>
                <p className="text-3xl sm:text-4xl font-bold text-red-600">{stats.pendingOrders}</p>
                <p className="text-gray-500 text-sm mt-3">Awaiting preparation</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <p className="text-gray-600 text-sm font-semibold mb-2">Upcoming Revenue</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</p>
                <p className="text-gray-500 text-sm mt-3">From pending orders</p>
              </div>
            </div>
          )}

          {/* Active Orders Section */}
          {activeTab === "orders" && (
            <>
              {Object.keys(groupedOrders).length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {Object.entries(groupedOrders).map(([tableId, tableOrders]) => {
                    const activeOrders = tableOrders.filter((o) => o.status !== "completed");
                    const completedOrders = tableOrders.filter((o) => o.status === "completed");
                    const firstOrder = tableOrders[0];

                    return (
                      <div key={tableId} className="rounded-2xl border-2 border-gray-300 bg-white p-6">
                        {/* Table Header */}
                        <div className="flex items-start justify-between mb-6 pb-4 border-b-2 border-gray-200">
                          <div>
                            <h3 className="text-2xl sm:text-3xl font-bold text-black">{firstOrder.tableLabel}</h3>
                            {getTableName(tableId) && (
                              <p className="text-gray-600 text-sm mt-1">Atas nama: <span className="font-semibold">{getTableName(tableId)}</span></p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleChangeTable(tableId)}
                              className="px-3 py-1 text-xs font-bold text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-full transition-all flex items-center gap-1"
                            >
                              <ArrowRight size={12} />
                              <span>Change</span>
                            </button>
                            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                              {tableOrders.length} order{tableOrders.length > 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>

                        {/* Active Orders Section */}
                        {activeOrders.length > 0 && (
                          <div className="mb-6">
                            <h4 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                              <span className="text-yellow-600">●</span>
                              Active ({activeOrders.length})
                            </h4>
                            <div className="space-y-4">
                              {activeOrders.map((order) => (
                                <div key={order.orderId} className={`rounded-xl p-4 ${getStatusColor(order.status)} border-2`}>
                                  {/* Order Header */}
                                  <div className="flex items-start justify-between mb-3">
                                    <div>
                                      <p className="text-gray-600 text-xs font-semibold">Order {order.orderId.slice(-5)}</p>
                                      <p className="text-gray-600 text-sm flex items-center gap-1 mt-1">
                                        <Clock size={14} />
                                        {formatTime(order.timestamp)}
                                      </p>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${getStatusBadgeColor(order.status)}`}>
                                      {order.status === "in_progress" ? "In Progress" : order.status}
                                    </span>
                                  </div>

                                  {/* Order Items */}
                                  <div className="bg-white/60 rounded-lg p-3 mb-3 space-y-1">
                                    {order.items.map((item, idx) => (
                                      <div key={idx} className="flex justify-between items-start text-xs sm:text-sm">
                                        <span className="text-black font-semibold">{item.name} x{item.quantity}</span>
                                        <span className="text-black font-bold">{item.price}</span>
                                      </div>
                                    ))}
                                  </div>

                                  {/* Total */}
                                  <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-200">
                                    <p className="font-bold text-black text-sm">Total</p>
                                    <p className="text-lg font-bold text-primary-brown">{formatCurrency(order.totalPrice)}</p>
                                  </div>

                                  {/* Status Buttons */}
                                  <div className="flex gap-2">
                                    {order.status === "pending" && (
                                      <button
                                        onClick={() => handleStatusChange(order.orderId, "in_progress")}
                                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-1 text-sm"
                                      >
                                        <Clock size={16} />
                                        <span className="hidden sm:inline">Start</span>
                                      </button>
                                    )}

                                    {order.status === "in_progress" && (
                                      <button
                                        onClick={() => handleStatusChange(order.orderId, "completed")}
                                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-1 text-sm"
                                      >
                                        <Check size={16} />
                                        <span className="hidden sm:inline">Complete</span>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Completed Orders Section - Combined Card */}
                        {completedOrders.length > 0 && (
                          <div>
                            <h4 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                              <span className="text-green-600">●</span>
                              Completed ({completedOrders.length})
                            </h4>
                            <div className="rounded-xl p-4 bg-green-50 border-2 border-green-200">
                              {/* Combined Orders Info */}
                              <div className="flex items-start justify-between mb-4">
                                <div>
                                  <p className="text-gray-600 text-xs font-semibold">
                                    {completedOrders.length} order{completedOrders.length > 1 ? "s" : ""} completed
                                  </p>
                                  <p className="text-gray-600 text-sm flex items-center gap-1 mt-1">
                                    <Clock size={14} />
                                    {formatTime(completedOrders[0].timestamp)}
                                  </p>
                                </div>
                                <span className="px-2 py-0.5 rounded-full text-xs font-bold uppercase bg-green-100 text-green-800">
                                  Ready for Payment
                                </span>
                              </div>

                              {/* All Items Combined */}
                              <div className="bg-white/60 rounded-lg p-3 mb-4 space-y-1">
                                {completedOrders.flatMap((order) =>
                                  order.items.map((item, idx) => (
                                    <div key={`${order.orderId}-${idx}`} className="flex justify-between items-start text-xs sm:text-sm">
                                      <span className="text-black font-semibold">{item.name} x{item.quantity}</span>
                                      <span className="text-black font-bold">{item.price}</span>
                                    </div>
                                  ))
                                )}
                              </div>

                              {/* Combined Total */}
                              <div className="flex justify-between items-center mb-4 pb-3 border-b border-green-300">
                                <p className="font-bold text-black text-sm">Total</p>
                                <p className="text-xl font-bold text-green-700">
                                  {formatCurrency(
                                    completedOrders.reduce((sum, order) => sum + order.totalPrice, 0)
                                  )}
                                </p>
                              </div>

                              {/* Single Payment Button */}
                              <button
                                onClick={() => {
                                  if (activeOrders.length === 0) {
                                    handlePayment(tableId);
                                  }
                                }}
                                disabled={activeOrders.length > 0}
                                className={`w-full font-bold py-2 sm:py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
                                  activeOrders.length > 0
                                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                                    : "bg-primary-brown hover:bg-primary-brown/90 text-white cursor-pointer"
                                }`}
                              >
                                <span>💳 Process Payment</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 sm:py-16 bg-white rounded-2xl border border-gray-200">
                  <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 text-lg font-semibold">No orders yet</p>
                  <p className="text-gray-500 text-sm mt-2">Orders will appear here when tables start ordering</p>
                </div>
              )}
            </>
          )}

          {/* Order History Section */}
          {activeTab === "history" && (
            <div>
              {paidOrders.length > 0 ? (
                <div className="space-y-6">
                  {/* Summary Stats for History */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                      <p className="text-gray-600 text-sm font-semibold mb-2">Total Payment Invoices</p>
                      <p className="text-3xl sm:text-4xl font-bold text-green-600">
                        {Object.keys(
                          paidOrders.reduce(
                            (acc, order) => {
                              acc[order.paymentSessionId] = true;
                              return acc;
                            },
                            {} as Record<string, boolean>
                          )
                        ).length}
                      </p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                      <p className="text-gray-600 text-sm font-semibold mb-2">Total Revenue (Paid)</p>
                      <p className="text-3xl sm:text-4xl font-bold text-green-600">
                        {formatCurrency(paidOrders.reduce((sum, order) => sum + order.totalPrice, 0))}
                      </p>
                    </div>
                  </div>

                  {/* History Grid - Grouped by Payment Session */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
                    {Object.entries(
                      paidOrders.reduce(
                        (acc, order) => {
                          if (!acc[order.paymentSessionId]) {
                            acc[order.paymentSessionId] = [];
                          }
                          acc[order.paymentSessionId].push(order);
                          return acc;
                        },
                        {} as Record<string, typeof paidOrders>
                      )
                    ).map(([paymentSessionId, sessionOrders]) => {
                      const firstOrder = sessionOrders[0];
                      const firstOrderTime = firstOrder.firstOrderTime;
                      const invoiceTotal = sessionOrders.reduce((sum, order) => sum + order.totalPrice, 0);
                      const paymentTime = firstOrder.paidAt;

                      return (
                        <div key={paymentSessionId} className="rounded-2xl border-2 border-green-200 bg-green-50 p-6">
                          {/* Invoice Header */}
                          <div className="flex items-start justify-between mb-4 pb-4 border-b-2 border-green-200">
                            <div>
                              <h3 className="text-2xl sm:text-3xl font-bold text-black">{firstOrder.tableLabel}</h3>
                              {firstOrder.customerName && (
                                <p className="text-gray-600 text-sm mt-1">Atas nama: <span className="font-semibold">{firstOrder.customerName}</span></p>
                              )}
                              <div className="space-y-1 mt-2">
                                <p className="text-gray-600 text-sm flex items-center gap-1">
                                  <Clock size={14} />
                                  <span className="font-semibold">Started:</span> {new Date(firstOrderTime).toLocaleDateString("id-ID")} {new Date(firstOrderTime).toLocaleTimeString("id-ID")}
                                </p>
                                <p className="text-gray-600 text-sm flex items-center gap-1">
                                  <Clock size={14} />
                                  <span className="font-semibold">Paid:</span> {new Date(paymentTime).toLocaleDateString("id-ID")} {new Date(paymentTime).toLocaleTimeString("id-ID")}
                                </p>
                              </div>
                            </div>
                            <span className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                              Invoice #{paymentSessionId.slice(-5)}
                            </span>
                          </div>

                          {/* All Items Combined from this Payment */}
                          <div className="bg-white/50 rounded-xl p-4 sm:p-5 mb-4 space-y-2">
                            {sessionOrders.flatMap((order) =>
                              order.items.map((item, idx) => (
                                <div key={`${order.orderId}-${idx}`} className="flex justify-between items-start text-sm sm:text-base">
                                  <div>
                                    <p className="font-semibold text-black">{item.name}</p>
                                    <p className="text-gray-600 text-xs sm:text-sm">Qty: {item.quantity}</p>
                                  </div>
                                  <p className="font-bold text-black">{item.price}</p>
                                </div>
                              ))
                            )}
                          </div>

                          {/* Invoice Total */}
                          <div className="border-t-2 border-green-300 pt-3 flex justify-between items-center">
                            <p className="font-bold text-black">Invoice Total</p>
                            <p className="text-xl sm:text-2xl font-bold text-green-700">
                              {formatCurrency(invoiceTotal)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 sm:py-16 bg-white rounded-2xl border border-gray-200">
                  <Check size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 text-lg font-semibold">No paid orders yet</p>
                  <p className="text-gray-500 text-sm mt-2">Completed orders will appear here</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Payment QR Modal */}
      {paymentTableId && !showPaymentSuccess && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl">
            <div className="text-center">
              <h3 className="text-2xl sm:text-3xl font-bold text-black mb-6">Scan for Payment</h3>
              
              {/* Dummy QR Code */}
              <div className="bg-gray-100 rounded-2xl p-6 mb-6 flex items-center justify-center">
                <div className="w-48 h-48 sm:w-56 sm:h-56 bg-white border-4 border-gray-300 rounded-xl flex items-center justify-center relative overflow-hidden">
                  {/* Dummy QR Pattern */}
                  <svg className="w-full h-full" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    {/* Corner patterns */}
                    <rect x="10" y="10" width="50" height="50" fill="black"/>
                    <rect x="20" y="20" width="30" height="30" fill="white"/>
                    <rect x="25" y="25" width="20" height="20" fill="black"/>
                    
                    <rect x="140" y="10" width="50" height="50" fill="black"/>
                    <rect x="150" y="20" width="30" height="30" fill="white"/>
                    <rect x="155" y="25" width="20" height="20" fill="black"/>
                    
                    <rect x="10" y="140" width="50" height="50" fill="black"/>
                    <rect x="20" y="150" width="30" height="30" fill="white"/>
                    <rect x="25" y="155" width="20" height="20" fill="black"/>
                    
                    {/* Random pattern for center */}
                    <circle cx="100" cy="100" r="30" fill="black" opacity="0.3"/>
                    <text x="100" y="108" textAnchor="middle" fontSize="16" fontWeight="bold" fill="black">QR</text>
                  </svg>
                </div>
              </div>

              <p className="text-gray-600 text-sm sm:text-base mb-2">Processing payment...</p>
              <p className="text-primary-brown font-bold text-lg sm:text-xl">Tunggu 3 detik</p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Success Notification */}
      {showPaymentSuccess && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl animate-bounce">
            <div className="text-center">
              {/* Success Icon */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <Check size={48} className="text-green-600 sm:w-14 sm:h-14" />
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-bold text-black mb-2">Payment Successful!</h3>
              <p className="text-gray-600 text-sm sm:text-base">Order has been paid and removed from queue</p>
            </div>
          </div>
        </div>
      )}

      {/* Change Table Modal */}
      {showChangeTableModal && selectedTableIdForChange && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-black">Select New Table</h3>
              <button
                onClick={() => {
                  setShowChangeTableModal(false);
                  setSelectedTableIdForChange(null);
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Available tables for relocation from {selectedTableIdForChange}:
            </p>

            {/* Available Tables Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
              {availableTables.map((table) => (
                <button
                  key={table.id}
                  onClick={() => handleConfirmTableChange(table.id)}
                  className="group p-4 rounded-xl border-2 border-gray-200 hover:border-primary-brown bg-white hover:bg-primary-brown/5 transition-all"
                >
                  <p className="font-bold text-black text-lg mb-1">{table.label}</p>
                  <p className="text-gray-600 text-sm">{table.seats} seats</p>
                </button>
              ))}
            </div>

            {availableTables.length === 0 && (
              <div className="text-center py-8">
                <AlertCircle size={40} className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600">No available tables at the moment</p>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowChangeTableModal(false);
                  setSelectedTableIdForChange(null);
                }}
                className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Payment Modal */}
      {showQuickPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-t-2xl flex items-center justify-between">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">⚡ Quick Payment</h2>
                <p className="text-green-100 text-sm mt-1">Tables ready for payment</p>
              </div>
              <button
                onClick={() => setShowQuickPaymentModal(false)}
                className="text-white hover:bg-green-800 p-2 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {/* Search Bar */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Search by Table Number or Customer Name
                </label>
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={quickPaymentSearch}
                    onChange={(e) => setQuickPaymentSearch(e.target.value)}
                    placeholder="e.g., Table 5, Budi, table-5"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                  />
                </div>
              </div>

              {/* Tables List */}
              <div className="space-y-3 max-h-[calc(90vh-300px)] overflow-y-auto">
                {filteredQuickPaymentTables.length > 0 ? (
                  filteredQuickPaymentTables.map((item) => {
                    const completedAmount = item.completedOrders.reduce((sum, o) => sum + o.totalPrice, 0);
                    const pendingAmount = item.pendingOrders.reduce((sum, o) => sum + o.totalPrice, 0);
                    const inProgressAmount = item.inProgressOrders.reduce((sum, o) => sum + o.totalPrice, 0);
                    const incompleteAmount = pendingAmount + inProgressAmount;
                    const totalAmount = completedAmount + incompleteAmount;
                    const isSelected = selectedQuickPaymentTableId === item.tableId;
                    const canPayNow = item.pendingOrders.length === 0 && item.inProgressOrders.length === 0 && item.completedOrders.length > 0;

                    return (
                      <div key={item.tableId}>
                        <button
                          onClick={() =>
                            setSelectedQuickPaymentTableId(
                              isSelected ? null : item.tableId
                            )
                          }
                          className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                            isSelected
                              ? "border-green-600 bg-green-50"
                              : "border-gray-200 bg-white hover:border-green-300"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-bold text-black text-lg">
                                {item.tableInfo?.label}
                              </h3>
                              {item.customerName && (
                                <p className="text-gray-600 text-sm mt-1">
                                  Atas nama: <span className="font-semibold">{item.customerName}</span>
                                </p>
                              )}
                              <p className="text-gray-600 text-sm mt-2">
                                ✓ {item.completedOrders.length} order{item.completedOrders.length > 1 ? "s" : ""}
                                {item.pendingOrders.length > 0 && (
                                  <span className="text-orange-600 ml-2">
                                    ⏳ {item.pendingOrders.length} can cancel
                                  </span>
                                )}
                                {item.inProgressOrders.length > 0 && (
                                  <span className="text-red-600 ml-2">
                                    🔄 {item.inProgressOrders.length} locked
                                  </span>
                                )}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-green-600">
                                {formatCurrency(completedAmount)}
                              </p>
                              {incompleteAmount > 0 && (
                                <p className="text-sm text-orange-600 mt-1">
                                  -{formatCurrency(incompleteAmount)}
                                </p>
                              )}
                              {isSelected && (
                                <Check size={20} className="text-green-600 mt-2" />
                              )}
                            </div>
                          </div>
                        </button>

                        {/* Order Details when selected */}
                        {isSelected && (
                          <div className="bg-gray-50 p-4 rounded-xl mt-2 border border-green-200">
                            {/* Completed Orders */}
                            {item.completedOrders.length > 0 && (
                              <div className="mb-4">
                                <h4 className="font-bold text-green-700 mb-3 flex items-center gap-2">
                                  <Check size={18} />
                                  Completed Orders ({item.completedOrders.length})
                                </h4>
                                <div className="bg-white rounded-lg p-3 space-y-2">
                                  {item.completedOrders.map((order) => (
                                    <div key={order.orderId} className="border-b border-gray-200 pb-2 last:border-b-0">
                                      <p className="text-xs text-gray-500 font-semibold mb-1">Order {order.orderId.slice(-5)}</p>
                                      <div className="space-y-1">
                                        {order.items.map((orderItem, idx) => (
                                          <div
                                            key={`${order.orderId}-${idx}`}
                                            className="flex justify-between text-sm text-gray-700"
                                          >
                                            <span>{orderItem.name} x{orderItem.quantity}</span>
                                            <span className="font-semibold">{orderItem.price}</span>
                                          </div>
                                        ))}
                                      </div>
                                      <div className="flex justify-between text-sm mt-2 pt-2 border-t border-gray-100">
                                        <span className="font-semibold">Subtotal:</span>
                                        <span className="font-bold text-green-600">{formatCurrency(order.totalPrice)}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Incomplete Orders */}
                            {(item.pendingOrders.length > 0 || item.inProgressOrders.length > 0) && (
                              <div className="mb-4">
                                <h4 className="font-bold text-orange-700 mb-3 flex items-center gap-2">
                                  <AlertCircle size={18} />
                                  Awaiting ({item.pendingOrders.length} pending, {item.inProgressOrders.length} in progress)
                                </h4>
                                <div className="bg-blue-50 border border-blue-200 p-2 rounded-lg mb-3 text-xs text-blue-800">
                                  ℹ️ Only <span className="font-semibold">Pending</span> orders can be cancelled. <span className="font-semibold">In Progress</span> orders are locked.
                                </div>
                                <div className="bg-orange-50 rounded-lg p-3 space-y-3 border border-orange-200">
                                  {[...item.pendingOrders, ...item.inProgressOrders].map((order) => (
                                    <div key={order.orderId} className="border-b border-orange-200 pb-3 last:border-b-0">
                                      <div className="flex items-start justify-between mb-2">
                                        <div>
                                          <p className="text-xs text-orange-600 font-semibold">Order {order.orderId.slice(-5)}</p>
                                          <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded mt-1 inline-block">
                                            {order.status === "pending" ? "Pending" : "In Progress"}
                                          </span>
                                        </div>
                                        <button
                                          onClick={() => {
                                            if (order.status === "pending") {
                                              handleDeleteOrderInQuickPayment(order.orderId);
                                            }
                                          }}
                                          disabled={order.status !== "pending"}
                                          className={`p-1 rounded transition-colors ${
                                            order.status === "pending"
                                              ? "text-red-600 hover:bg-red-100 cursor-pointer"
                                              : "text-gray-400 cursor-not-allowed opacity-50"
                                          }`}
                                          title={
                                            order.status === "pending"
                                              ? "Delete this order"
                                              : "Cannot delete: Order in progress"
                                          }
                                        >
                                          <X size={18} />
                                        </button>
                                      </div>
                                      <div className="space-y-1 ml-2">
                                        {order.items.map((orderItem, idx) => (
                                          <div
                                            key={`${order.orderId}-${idx}`}
                                            className="flex justify-between text-sm text-gray-700"
                                          >
                                            <span>{orderItem.name} x{orderItem.quantity}</span>
                                            <span className="font-semibold">{orderItem.price}</span>
                                          </div>
                                        ))}
                                      </div>
                                      <div className="flex justify-between text-sm mt-2 pt-2 border-t border-orange-200">
                                        <span className="font-semibold">Subtotal:</span>
                                        <span className="font-bold text-orange-600">{formatCurrency(order.totalPrice)}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Total Summary */}
                            <div className="bg-white rounded-lg p-3 border border-green-200">
                              <div className="flex justify-between mb-2">
                                <span className="text-sm text-gray-600">Completed:</span>
                                <span className="font-semibold text-green-600">{formatCurrency(completedAmount)}</span>
                              </div>
                              {incompleteAmount > 0 && (
                                <div className="flex justify-between text-sm mb-2 pb-2 border-b border-gray-200">
                                  <span className="text-gray-600">Pending (to cancel):</span>
                                  <span className="font-semibold text-orange-600">-{formatCurrency(incompleteAmount)}</span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span className="font-bold text-black">Final Total:</span>
                                <span className="font-bold text-lg text-green-600">{formatCurrency(completedAmount)}</span>
                              </div>
                            </div>

                            {canPayNow && (
                              <p className="text-sm text-green-600 font-semibold mt-3 text-center bg-green-50 p-2 rounded">
                                ✓ Ready to process payment
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12">
                    <AlertCircle size={40} className="mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-600">
                      {quickPaymentSearch
                        ? "No tables match your search"
                        : "No tables with completed orders"}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowQuickPaymentModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    if (selectedQuickPaymentTableId) {
                      const selectedTable = filteredQuickPaymentTables.find((t) => t.tableId === selectedQuickPaymentTableId);
                      if (selectedTable && selectedTable.completedOrders.length > 0) {
                        handleQuickPayment(selectedQuickPaymentTableId);
                      }
                    }
                  }}
                  disabled={!selectedQuickPaymentTableId || !filteredQuickPaymentTables.find((t) => t.tableId === selectedQuickPaymentTableId)?.completedOrders.length}
                  className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                    selectedQuickPaymentTableId && filteredQuickPaymentTables.find((t) => t.tableId === selectedQuickPaymentTableId)?.completedOrders.length
                      ? "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  <span>💳 Process Payment</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
