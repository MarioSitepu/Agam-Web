"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AVAILABLE_TABLES } from "@/components/TableSelector";
import { ArrowLeft, Clock, AlertCircle, Check, X } from "lucide-react";
import { useCashierOrders } from "@/context/CashierOrdersContext";

export default function CashierDashboard() {
  // Get orders from context
  const { orders, paidOrders, updateOrderStatus, removeOrder, processPaidOrders } = useCashierOrders();

  const [activeTab, setActiveTab] = useState<"orders" | "history">("orders");
  const [paymentTableId, setPaymentTableId] = useState<string | null>(null);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

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

          {/* Statistics Cards - Only show on Orders tab */}
          {activeTab === "orders" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <p className="text-gray-600 text-sm font-semibold mb-2">Active Tables</p>
                <p className="text-3xl sm:text-4xl font-bold text-black">{stats.totalOrders}</p>
                <p className="text-gray-500 text-sm mt-3">{23 - stats.totalOrders} tables available</p>
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
                          </div>
                          <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {tableOrders.length} order{tableOrders.length > 1 ? "s" : ""}
                          </span>
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
                                onClick={() => handlePayment(tableId)}
                                className="w-full bg-primary-brown hover:bg-primary-brown/90 text-white font-bold py-2 sm:py-3 rounded-lg transition-all flex items-center justify-center gap-2"
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
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                      const invoiceTotal = sessionOrders.reduce((sum, order) => sum + order.totalPrice, 0);
                      const paymentTime = firstOrder.paidAt;

                      return (
                        <div key={paymentSessionId} className="rounded-2xl border-2 border-green-200 bg-green-50 p-6">
                          {/* Invoice Header */}
                          <div className="flex items-start justify-between mb-4 pb-4 border-b-2 border-green-200">
                            <div>
                              <h3 className="text-2xl sm:text-3xl font-bold text-black">{firstOrder.tableLabel}</h3>
                              <p className="text-gray-600 text-sm flex items-center gap-1 mt-1">
                                <Clock size={14} />
                                {new Date(paymentTime).toLocaleDateString("id-ID")} at {new Date(paymentTime).toLocaleTimeString("id-ID")}
                              </p>
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

      <Footer />
    </div>
  );
}
