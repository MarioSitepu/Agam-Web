"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, Settings, ShoppingCart } from "lucide-react";
import { useOrder } from "@/context/OrderContext";
import OrderItemRow from "./OrderItemRow";

/**
 * OrderSummary - Comprehensive order summary panel component
 *
 * Props:
 * - isCollapsed: Whether panel is collapsed (mobile responsive)
 * - onCollapseChange: Callback to handle collapse/expand toggle
 * - onCheckout: Callback when Checkout button is clicked
 * - onModify: Callback when Modify Order button is clicked
 * - isLoading: Loading/processing state during checkout
 *
 * Design:
 * - Sticky positioning on desktop (lg:sticky)
 * - Collapsible on mobile with collapse/expand toggle
 * - Clear visual hierarchy: items, customizations, notes, total, actions
 * - Consistent padding and spacing throughout
 * - Responsive scrolling for items list
 *
 * Features:
 * - Real-time order item display via useOrder hook
 * - Item removal via OrderItemRow callback
 * - Action buttons with clear visual hierarchy
 * - Empty state messaging
 * - Loading/processing states during checkout
 */

interface OrderSummaryProps {
  isCollapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
  onCheckout?: () => void;
  onModify?: () => void;
  isLoading?: boolean;
}

export default function OrderSummary({
  isCollapsed = false,
  onCollapseChange,
  onCheckout,
  onModify,
  isLoading = false,
}: OrderSummaryProps) {
  const { orderItems, removeOrderItem, getTotalPrice, getTotalItems } =
    useOrder();
  const [localCollapsed, setLocalCollapsed] = useState(isCollapsed);

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();
  const hasItems = orderItems.length > 0;

  /**
   * Handle collapse toggle
   */
  const handleToggleCollapse = () => {
    const newCollapsed = !localCollapsed;
    setLocalCollapsed(newCollapsed);
    onCollapseChange?.(newCollapsed);
  };

  /**
   * Format price for display
   */
  const formatPrice = (priceInRupiah: number): string => {
    if (priceInRupiah >= 1000000) {
      return (priceInRupiah / 1000000).toFixed(0) + "M";
    } else if (priceInRupiah >= 1000) {
      return (priceInRupiah / 1000).toFixed(0) + "K";
    }
    return "0";
  };

  return (
    <div className="lg:sticky lg:top-28 w-full lg:h-fit">
      {/* Mobile Collapse Button (visible only on mobile) */}
      <button
        onClick={handleToggleCollapse}
        className="lg:hidden w-full bg-gradient-to-r from-primary-brown to-primary-brown/80 text-white py-2.5 sm:py-3 rounded-t-2xl font-bold uppercase tracking-wider text-xs sm:text-sm flex items-center justify-between px-3 sm:px-4 sticky top-0 z-20"
      >
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          <span>Order Summary ({totalItems})</span>
        </div>
        {localCollapsed ? <ChevronUp className="w-5 h-5 sm:w-5 sm:h-5" /> : <ChevronDown className="w-5 h-5 sm:w-5 sm:h-5" />}
      </button>

      {/* Summary Panel - Main Container */}
      <div
        className={`bg-bg-dark rounded-none lg:rounded-3xl p-4 sm:p-5 md:p-6 border border-white/10 transition-all duration-300 ${
          localCollapsed ? "lg:max-h-none max-h-0 lg:max-h-full overflow-hidden" : "max-h-full"
        } lg:max-h-none lg:overflow-visible`}
      >
        {/* Header */}
        <div className="hidden lg:flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-white text-base sm:text-lg md:text-xl font-bold uppercase tracking-wider">
            Order Summary
          </h2>
          {hasItems && (
            <span className="bg-primary-brown/20 text-primary-brown px-2 sm:px-3 py-1 rounded-full text-xs font-bold">
              {totalItems} item{totalItems !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Items List Container */}
        <div
          className={`space-y-2 sm:space-y-3 mb-4 sm:mb-6 ${
            hasItems
              ? "max-h-60 sm:max-h-64 lg:max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
              : ""
          }`}
        >
          {hasItems ? (
            orderItems.map((orderItem) => (
              <OrderItemRow
                key={orderItem.id}
                orderItemId={orderItem.id}
                menuItemName={orderItem.menuItemName}
                menuItemPrice={orderItem.menuItemPrice}
                quantity={orderItem.quantity}
                customizations={orderItem.customizations}
                notes={orderItem.notes}
                onRemove={removeOrderItem}
              />
            ))
          ) : (
            <div className="text-center py-8 sm:py-12 lg:py-8">
              <ShoppingCart className="w-8 h-8 sm:w-8 sm:h-8 text-gray-500 mx-auto mb-2 sm:mb-3 opacity-50" />
              <p className="text-gray-500 text-xs sm:text-sm font-medium">
                👆 Select items to start ordering
              </p>
            </div>
          )}
        </div>

        {/* Divider */}
        {hasItems && <div className="border-t border-white/10 mb-4 sm:mb-6" />}

        {/* Pricing Section */}
        {hasItems && (
          <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 bg-[#1A1A1A] rounded-lg sm:rounded-2xl p-3 sm:p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-[10px] sm:text-xs md:text-sm uppercase font-semibold tracking-wider">
                Subtotal:
              </span>
              <span className="text-white font-bold text-xs sm:text-sm md:text-base">
                {formatPrice(totalPrice)}
              </span>
            </div>

            <div className="border-t border-white/10 pt-2 sm:pt-3 flex justify-between items-center">
              <span className="text-white text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider">
                Total:
              </span>
              <span className="text-secondary-gold text-xl sm:text-2xl md:text-3xl font-bold">
                {formatPrice(totalPrice)}
              </span>
            </div>

            <p className="text-gray-500 text-[9px] sm:text-[10px] md:text-[11px] text-center mt-1 sm:mt-2">
              VAT included (if applicable)
            </p>
          </div>
        )}

        {/* Action Buttons */}
        {hasItems && (
          <div className="mt-4 sm:mt-6 space-y-2 flex flex-col gap-2 sm:gap-3">
            <button
              onClick={onCheckout}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary-brown to-primary-brown/80 hover:from-primary-brown/90 hover:to-primary-brown/70 text-white py-2.5 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl font-bold uppercase tracking-wider text-xs sm:text-sm md:text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-lg hover:shadow-xl"
            >
              {isLoading ? "Processing..." : "Checkout"}
            </button>

            <button
              onClick={onModify}
              disabled={isLoading}
              className="w-full bg-[#333333] hover:bg-[#444444] text-white py-2 sm:py-2.5 md:py-3 rounded-xl sm:rounded-2xl font-bold uppercase tracking-wider text-[11px] sm:text-xs md:text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center gap-2"
            >
              <Settings className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5" />
              <span>Modify Order</span>
            </button>
          </div>
        )}

        {/* Footer Message */}
        {!hasItems && (
          <div className="hidden lg:block text-center py-4 text-gray-500 text-xs">
            <p>Your order is empty</p>
          </div>
        )}
      </div>
    </div>
  );
}
