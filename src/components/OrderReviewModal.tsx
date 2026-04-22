"use client";

import { X } from "lucide-react";
import { useOrder } from "@/context/OrderContext";

/**
 * OrderReviewModal - Shows detailed order summary before confirmation
 *
 * Props:
 * - isOpen: Whether modal is visible
 * - tableId: Current table ID
 * - tableLabel: Display-friendly table label (e.g., "Table 1")
 * - onClose: Callback to close modal (Modify action)
 * - onConfirm: Callback when Order button clicked
 * - isLoading: Loading state during submission
 *
 * Features:
 * - Detailed breakdown of all items
 * - Customizations shown for each item
 * - Order total calculation
 * - Two action buttons: Order (primary) & Modify (secondary)
 * - Scroll for large orders
 * - Responsive design
 */

interface OrderReviewModalProps {
  isOpen: boolean;
  tableId: string;
  tableLabel: string;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function OrderReviewModal({
  isOpen,
  tableId,
  tableLabel,
  onClose,
  onConfirm,
  isLoading = false,
}: OrderReviewModalProps) {
  const { orderItems, getTotalPrice } = useOrder();
  const totalPrice = getTotalPrice();

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

  /**
   * Parse price string to number (e.g. "29K" -> 29000)
   */
  const parsePrice = (priceStr: string): number => {
    const cleanStr = priceStr.split("/")[0].toUpperCase();
    const numeric = cleanStr.replace(/[^0-9]/g, "");
    return parseInt(numeric) * 1000 || 0;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-[#111111] rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl pointer-events-auto border border-white/20"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-linear-to-r from-primary-brown to-primary-brown/80 text-white px-6 py-5 flex items-center justify-between border-b border-white/10 z-10">
            <div>
              <h2 className="text-xl font-bold uppercase tracking-wider">
                Order Review
              </h2>
              <p className="text-sm text-white/80 mt-1">{tableLabel}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6 space-y-6">
            {/* Items List */}
            <div className="space-y-4">
              <h3 className="text-white text-sm font-bold uppercase tracking-wider">
                Items Ordered
              </h3>

              <div className="space-y-3 bg-[#1A1A1A] rounded-2xl p-4 max-h-64 overflow-y-auto">
                {orderItems.map((item, idx) => {
                  const itemBasePrice = parsePrice(item.menuItemPrice);
                  const customizationPrice = item.customizations.reduce(
                    (acc, c) => acc + (c.price || 0),
                    0
                  );
                  const itemTotal =
                    (itemBasePrice + customizationPrice) * item.quantity;

                  return (
                    <div
                      key={item.id}
                      className="border-b border-white/10 pb-3 last:border-b-0 last:pb-0"
                    >
                      {/* Item Header */}
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-white font-bold text-sm">
                            {item.menuItemName}
                          </p>
                          <p className="text-secondary-gold text-xs">
                            × {item.quantity}
                          </p>
                        </div>
                        <p className="text-secondary-gold font-bold text-sm">
                          {formatPrice(itemTotal)}
                        </p>
                      </div>

                      {/* Breakdown */}
                      <div className="flex justify-between text-gray-400 text-xs ml-2 mb-2">
                        <span>
                          {item.menuItemPrice} × {item.quantity}
                        </span>
                        <span>
                          {formatPrice(itemBasePrice * item.quantity)}
                        </span>
                      </div>

                      {/* Customizations */}
                      {item.customizations.length > 0 && (
                        <div className="bg-white/5 rounded-lg p-2 mb-2">
                          <p className="text-gray-500 text-[10px] uppercase font-semibold mb-1">
                            Customizations:
                          </p>
                          <div className="space-y-1">
                            {item.customizations.map((custom) => (
                              <div
                                key={custom.id}
                                className="flex justify-between text-gray-400 text-xs"
                              >
                                <span>• {custom.label === "spice-level" ? `Spicy Level: ${custom.value}` : custom.value}</span>
                                {typeof custom.price === "number" && custom.price > 0 ? (
                                  <span className="text-secondary-gold">
                                    +{formatPrice(custom.price * item.quantity)}
                                  </span>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Special Notes */}
                      {item.notes && (
                        <div className="bg-white/5 rounded-lg p-2">
                          <p className="text-gray-500 text-[10px] uppercase font-semibold mb-1">
                            Notes:
                          </p>
                          <p className="text-gray-400 text-xs italic">
                            "{item.notes}"
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10" />

            {/* Price Summary */}
            <div className="bg-[#1A1A1A] rounded-2xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Subtotal:</span>
                <span className="text-white font-bold">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              <div className="flex justify-between items-center border-t border-white/10 pt-3">
                <span className="text-white font-bold text-sm uppercase tracking-wider">
                  Total:
                </span>
                <span className="text-secondary-gold text-3xl font-bold">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              <p className="text-gray-500 text-[10px] text-center">
                ✓ VAT included (if applicable)
              </p>
            </div>
          </div>

          {/* Footer - Action Buttons */}
          <div className="sticky bottom-0 bg-[#1A1A1A] border-t border-white/10 px-6 py-4 flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 bg-[#333333] hover:bg-[#444444] text-white py-3 rounded-2xl font-bold uppercase tracking-wider text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              Modify
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 bg-linear-to-r from-primary-brown to-primary-brown/80 hover:from-primary-brown/90 hover:to-primary-brown/70 text-white py-3 rounded-2xl font-bold uppercase tracking-wider text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-lg"
            >
              {isLoading ? "Sending..." : "Order"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
