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
          className="bg-[#111111] rounded-2xl w-full max-w-xs shadow-2xl pointer-events-auto border border-white/20 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Success Header */}
          <div className="bg-linear-to-r from-green-600 to-green-500 text-white px-4 py-4 text-center">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <CheckCircle size={24} className="text-white" />
              </div>
            </div>
            <h2 className="text-base font-bold uppercase tracking-wider">
              Order Confirmed!
            </h2>
          </div>

          {/* Content */}
          <div className="px-4 py-4 space-y-3">
            {/* Confirmation Message */}
            <div className="text-center space-y-2">
              <p className="text-white text-sm font-bold">
                Your order has been sent to the cashier
              </p>
              <div className="bg-primary-brown/20 border border-primary-brown/50 rounded-xl p-2">
                <p className="text-secondary-gold text-lg font-bold uppercase tracking-wider">
                  {tableLabel}
                </p>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-[#1A1A1A] rounded-xl p-3 space-y-2 border border-white/10">
              <h3 className="text-white font-bold text-[10px] uppercase tracking-wider">
                Payment Information
              </h3>

              <div className="space-y-1.5">
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-secondary-gold/20 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary-gold" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-[10px] font-semibold">
                      Payment Method
                    </p>
                    <p className="text-white text-[11px]">Payment at Cashier</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-secondary-gold/20 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary-gold" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-[10px] font-semibold">
                      Your Order ID
                    </p>
                    <p className="text-white text-[11px] font-mono">
                      #{Math.random().toString(36).substr(2, 6).toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Text */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-2.5">
              <p className="text-blue-300 text-[10px] leading-relaxed">
                💡 Please proceed to the cashier to complete your payment.
              </p>
            </div>
          </div>

          {/* Footer - Action Buttons */}
          <div className="bg-[#1A1A1A] border-t border-white/10 px-4 py-3 space-y-2">
            {/* Reorder Button - Changed to button to properly close modal on the same page */}
            <button
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full bg-linear-to-r from-primary-brown to-primary-brown/80 text-white py-2 rounded-xl font-bold uppercase tracking-wider text-[11px] transition-all active:scale-95 shadow-lg"
            >
              <ShoppingCart size={14} />
              <span>Continue Ordering</span>
            </button>

            {/* Close/Done Button */}
            <button
              onClick={onClose}
              className="w-full bg-[#333333] hover:bg-[#444444] text-white py-1.5 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-all active:scale-95"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
