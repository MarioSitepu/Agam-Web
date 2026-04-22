"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useOrder } from "@/context/OrderContext";

/**
 * OrderItemRow - Individual order item display in Order Summary
 *
 * Props:
 * - orderItemId: Unique order item ID
 * - menuItemName: Name of the menu item
 * - menuItemPrice: Price string (e.g., "29K")
 * - quantity: Order quantity
 * - customizations: Array of customization selections
 * - notes: Special instructions
 * - onRemove: Callback when remove button is clicked
 *
 * Design:
 * - Compact, organized layout with clear information hierarchy
 * - Item name, quantity, customizations, and notes clearly separated
 * - Remove button easily accessible on right side
 * - Responsive text sizes (smaller on mobile)
 */

interface OrderItemRowProps {
  orderItemId: string;
  menuItemName: string;
  menuItemPrice: string;
  quantity: number;
  customizations: Array<{
    id: string;
    label: string;
    value: string;
    price?: number;
  }>;
  notes?: string;
  onRemove: (id: string) => void;
}

export default function OrderItemRow({
  orderItemId,
  menuItemName,
  menuItemPrice,
  quantity,
  customizations,
  notes,
  onRemove,
}: OrderItemRowProps) {
  return (
    <div className="bg-[#1A1A1A] rounded-2xl p-3 md:p-4 text-sm space-y-2 border border-white/5 hover:border-white/20 transition-colors">
      {/* Header: Name, Quantity, Remove Button */}
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-xs md:text-sm uppercase tracking-wider line-clamp-2">
            {menuItemName}
          </p>
          <p className="text-secondary-gold text-[11px] md:text-xs font-semibold">
            {menuItemPrice} × {quantity}
          </p>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => onRemove(orderItemId)}
          className="text-gray-400 hover:text-red-500 transition-colors shrink-0 p-1 hover:bg-red-500/10 rounded-lg"
          title="Remove item from order"
          aria-label={`Remove ${menuItemName} from order`}
        >
          <Trash2 size={16} className="md:w-5 md:h-5" />
        </button>
      </div>

      {/* Customizations - if any */}
      {customizations.length > 0 && (
        <div className="border-t border-white/10 pt-2">
          <p className="text-gray-500 text-[10px] md:text-[11px] uppercase font-bold tracking-wider mb-1">
            Custom:
          </p>
          <div className="space-y-1">
            {customizations.map((custom) => (
              <p key={custom.id} className="text-gray-400 text-[11px] md:text-xs leading-relaxed">
                • {custom.label === "spice-level" ? `Spicy Level: ${custom.value}` : custom.value}
                {typeof custom.price === "number" && custom.price > 0 ? (
                  <span className="text-secondary-gold ml-1 font-semibold">
                    +{(custom.price / 1000).toFixed(0)}K
                  </span>
                ) : null}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Special Notes - if any */}
      {notes && (
        <div className="border-t border-white/10 pt-2">
          <p className="text-gray-500 text-[10px] md:text-[11px] uppercase font-bold tracking-wider mb-1">
            Notes:
          </p>
          <p className="text-gray-400 text-[11px] md:text-xs italic leading-relaxed line-clamp-2">
            "{notes}"
          </p>
        </div>
      )}
    </div>
  );
}
