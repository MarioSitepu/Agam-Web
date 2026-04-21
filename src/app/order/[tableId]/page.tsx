"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MenuItemCard from "@/components/MenuItemCard";
import CustomizationModal from "@/components/CustomizationModal";
import OrderSummary from "@/components/OrderSummary";
import OrderReviewModal from "@/components/OrderReviewModal";
import OrderConfirmationModal from "@/components/OrderConfirmationModal";
import { menuData, MenuItem } from "@/data/menuData";
import { useOrder } from "@/context/OrderContext";
import { AVAILABLE_TABLES } from "@/components/TableSelector";
import { ArrowLeft, QrCode } from "lucide-react";

/**
 * Order Page - Full-featured digital menu ordering interface for specific table
 *
 * Dynamic Route: /order/[tableId]
 *
 * Features:
 * - Display current table ID at the top
 * - Back button to change table
 * - Category filter tabs with smooth scrolling on mobile
 * - Responsive menu grid (1-2 cols mobile, 2-3 cols tablet, 3-4 cols desktop)
 * - Modular OrderSummary component with collapse/expand on mobile
 * - Real-time order state via useOrder hook
 * - Consistent styling with design system
 *
 * Layout Structure:
 * - Desktop (lg): 3-column grid with menu items left (3-4 cols) and Order Summary right (1 col, sticky)
 * - Tablet (md): 2-column grid with responsive spacing
 * - Mobile (mobile): Single column with collapsible Order Summary panel at bottom
 */

export default function OrderPageWithTable() {
  const params = useParams();
  const router = useRouter();
  const tableId = params.tableId as string;

  // Get table info from AVAILABLE_TABLES
  const tableInfo = AVAILABLE_TABLES.find((t) => t.id === tableId);
  const tableLabel = tableInfo?.label || "Unknown Table";

  // Local state management
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderSummaryCollapsed, setOrderSummaryCollapsed] = useState(true);
  const [showOrderReview, setShowOrderReview] = useState(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // Get categories from menu data
  const allMenuItems = menuData
    .flatMap((category) => category.items)
    .sort((a, b) => a.name.localeCompare(b.name));

  const categoriesWithAll: typeof menuData = [
    {
      id: "all-menu",
      name: "Semua Menu",
      items: allMenuItems,
    },
    ...menuData.map((category) => ({
      ...category,
      items: [...category.items].sort((a, b) => a.name.localeCompare(b.name)),
    })),
  ];

  const categories = categoriesWithAll;
  const displayCategory = activeCategory
    ? categories.find((c) => c.id === activeCategory)
    : categories[0];

  /**
   * Handle menu item click - open customization modal
   */
  const handleOrderClick = (item: MenuItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  /**
   * Handle checkout action
   * Opens OrderReviewModal to show order summary
   */
  const handleCheckout = () => {
    setShowOrderReview(true);
  };

  /**
   * Handle order confirmation
   * Submits order to backend and shows confirmation modal
   */
  const handleOrderConfirm = async () => {
    setIsSubmittingOrder(true);
    try {
      // TODO: Send order to backend with tableId
      console.log(`Submitting order for ${tableLabel}`, {
        tableId,
        tableLabel,
        // orderItems from useOrder hook
      });
      // Simulate processing
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Close review modal and show confirmation
      setShowOrderReview(false);
      setShowOrderConfirmation(true);
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  /**
   * Handle modify order action
   * Closes review modal to allow editing
   */
  const handleModifyOrder = () => {
    setShowOrderReview(false);
  };

  /**
   * Handle confirmation modal close
   */
  const handleConfirmationDone = () => {
    setShowOrderConfirmation(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Main Content */}
      <main className="pt-20 md:pt-24 pb-4 md:pb-8 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Table Selection Banner + Back Button */}
          <div className="mb-6 md:mb-8 lg:mb-10 bg-gradient-to-r from-primary-brown/10 to-transparent rounded-2xl p-4 md:p-6 border border-primary-brown/20">
            <div className="flex items-center justify-between gap-4">
              {/* Table Info Section */}
              <div className="flex items-center gap-3 md:gap-4">
                {/* QR Icon */}
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary-brown flex items-center justify-center flex-shrink-0">
                  <QrCode size={20} className="md:w-6 md:h-6 text-white" />
                </div>

                {/* Table Details */}
                <div>
                  <p className="text-gray-600 text-xs md:text-sm font-semibold uppercase tracking-wider">
                    Dining at
                  </p>
                  <h2 className="text-primary-brown text-2xl md:text-3xl font-bold uppercase tracking-wider">
                    {tableLabel}
                  </h2>
                </div>
              </div>

              {/* Change Table Button */}
              <Link
                href="/order"
                className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-white border border-primary-brown text-primary-brown rounded-full font-bold text-xs md:text-sm hover:bg-primary-brown hover:text-white transition-all whitespace-nowrap"
                title="Change table"
              >
                <ArrowLeft size={16} className="md:w-5 md:h-5" />
                <span>Change Table</span>
              </Link>
            </div>
          </div>

          {/* Page Header */}
          <div className="mb-6 md:mb-8 lg:mb-10">
            <h1 className="text-black font-script text-4xl md:text-5xl lg:text-7xl mb-1 md:mb-2">
              Digital Menu
            </h1>
            <p className="text-gray-600 text-xs md:text-sm lg:text-base">
              Customize your order and place it for {tableLabel}
            </p>
          </div>

          {/* Two-Column Layout: Menu (Left) + Order Summary (Right Mobile: Bottom) */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Left Column: Menu Display */}
            <div className="lg:col-span-3 space-y-6">
              {/* Category Filter Tabs */}
              <div className="overflow-x-auto -mx-4 px-4 md:-mx-0 md:px-0">
                <div className="flex gap-2 md:gap-3 min-w-max md:min-w-full md:flex-wrap pb-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`px-3 md:px-5 py-2 md:py-2.5 rounded-full font-bold text-xs md:text-sm whitespace-nowrap transition-all flex-shrink-0 ${
                        activeCategory === category.id ||
                        (activeCategory === null && category.id === categories[0].id)
                          ? "bg-primary-brown text-white shadow-lg"
                          : "bg-[#F0F0F0] text-black hover:bg-[#E0E0E0]"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Menu Items Responsive Grid */}
              {displayCategory && displayCategory.items.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                  {displayCategory.items.map((item, idx) => (
                    <MenuItemCard
                      key={`${displayCategory.id}_${idx}`}
                      item={item}
                      onOrderClick={handleOrderClick}
                    />
                  ))}
                </div>
              ) : (
                <div className="col-span-full text-center py-16 md:py-20">
                  <p className="text-gray-500 text-base md:text-lg">
                    No items in this category
                  </p>
                </div>
              )}
            </div>

            {/* Right Column: Order Summary Sidebar (Desktop) & Bottom Panel (Mobile) */}
            <div className="lg:col-span-1">
              <OrderSummary
                isCollapsed={orderSummaryCollapsed}
                onCollapseChange={setOrderSummaryCollapsed}
                onCheckout={handleCheckout}
                onModify={handleModifyOrder}
                isLoading={false}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Customization Modal */}
      <CustomizationModal
        isOpen={isModalOpen}
        item={selectedItem}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedItem(null);
        }}
      />

      {/* Order Review Modal */}
      <OrderReviewModal
        isOpen={showOrderReview}
        tableId={tableId}
        tableLabel={tableLabel}
        onClose={handleModifyOrder}
        onConfirm={handleOrderConfirm}
        isLoading={isSubmittingOrder}
      />

      {/* Order Confirmation Modal */}
      <OrderConfirmationModal
        isOpen={showOrderConfirmation}
        tableId={tableId}
        tableLabel={tableLabel}
        onClose={handleConfirmationDone}
      />

      <Footer />
    </div>
  );
}
