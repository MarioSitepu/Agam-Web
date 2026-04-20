"use client";

import Link from "next/link";
import { CheckCircle, ShoppingCart } from "lucide-react";

/**
 * OrderConfirmationModal - Shows order confirmation after successful submission
 *
 * Props:
 * - isOpen: Whether modal is visible
 * - tableId: Table ID for creating reorder link
 * - tableLabel: Display-friendly table label (e.g., "Table 1")
 * - onClose: Callback to close modal
 *
 * Features:
 * - Confirmation message with table info
 * - Payment instructions (payment at cashier)
 * - Reorder button that navigates to /order/[tableId]
 * - Success indicator with checkmark
 * - Responsive design
 */

interface OrderConfirmationModalProps {
  isOpen: boolean;
  tableId: string;
  tableLabel: string;
  onClose: () => void;
}

export default function OrderConfirmationModal({
  isOpen,
  tableId,
  tableLabel,
  onClose,
}: OrderConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-[#111111] rounded-3xl w-full max-w-md shadow-2xl pointer-events-auto border border-white/20 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                <CheckCircle size={40} className="text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold uppercase tracking-wider">
              Order Confirmed!
            </h2>
          </div>

          {/* Content */}
          <div className="px-6 py-8 space-y-6">
            {/* Confirmation Message */}
            <div className="text-center space-y-3">
              <p className="text-white text-lg font-bold">
                Your order has been sent to the cashier
              </p>
              <div className="bg-primary-brown/20 border border-primary-brown/50 rounded-2xl p-4">
                <p className="text-secondary-gold text-2xl font-bold uppercase tracking-wider">
                  {tableLabel}
                </p>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-[#1A1A1A] rounded-2xl p-5 space-y-3 border border-white/10">
              <h3 className="text-white font-bold text-sm uppercase tracking-wider">
                Payment Information
              </h3>

              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-secondary-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-secondary-gold" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-semibold">
                      Payment Method
                    </p>
                    <p className="text-white text-sm">Payment at Cashier</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-secondary-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-secondary-gold" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-semibold">
                      Your Order ID
                    </p>
                    <p className="text-white text-sm font-mono">
                      #{Math.random().toString(36).substr(2, 9).toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Text */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4">
              <p className="text-blue-300 text-xs md:text-sm leading-relaxed">
                💡 Please proceed to the cashier to complete your payment. Your
                order ID is shown above for reference.
              </p>
            </div>
          </div>

          {/* Footer - Action Buttons */}
          <div className="bg-[#1A1A1A] border-t border-white/10 px-6 py-4 space-y-2">
            {/* Reorder Button */}
            <Link
              href={`/order/${tableId}`}
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-primary-brown to-primary-brown/80 hover:from-primary-brown/90 hover:to-primary-brown/70 text-white py-3 rounded-2xl font-bold uppercase tracking-wider text-sm transition-all active:scale-95 shadow-lg"
            >
              <ShoppingCart size={18} />
              <span>Continue Ordering</span>
            </Link>

            {/* Close/Done Button */}
            <button
              onClick={onClose}
              className="w-full bg-[#333333] hover:bg-[#444444] text-white py-2 rounded-2xl font-bold uppercase tracking-wider text-xs transition-all active:scale-95"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
