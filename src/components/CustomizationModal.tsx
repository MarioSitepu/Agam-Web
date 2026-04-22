"use client";

import { useState } from "react";
import { MenuItem } from "@/data/menuData";
import { useOrder, OrderItemCustomization } from "@/context/OrderContext";
import { X, Plus, Minus } from "lucide-react";

/**
 * CustomizationModal - Modal for customizing menu items before adding to order
 *
 * Features:
 * - Select quantity
 * - Add customizations (placeholder options that can be replaced with API data)
 * - Add special notes/instructions
 * - Real-time price calculation including customizations
 *
 * Props:
 * - isOpen: Boolean to show/hide modal
 * - item: MenuItem to customize
 * - onClose: Callback to close modal
 *
 * Future Enhancement:
 * - Replace hardcoded customizations with API call based on menuItemId
 * - Add payment integration (QR code, card, etc.)
 * - Save customizations as templates/favorites
 */

interface CustomizationModalProps {
  isOpen: boolean;
  item: MenuItem | null;
  onClose: () => void;
}

// Placeholder customization options
// In production, fetch these from backend based on menu item ID
const DEFAULT_CUSTOMIZATIONS = [
  {
    id: "spice-level",
    label: "Spice Level",
    options: ["Mild", "Medium", "Hot", "Extra Hot"],
  },
  {
    id: "add-extras",
    label: "Add Extras",
    options: ["Extra Prawn (+5K)", "Extra Egg (+3K)", "Extra Vegetables (+2K)"],
  },
  {
    id: "no-items",
    label: "Remove Items",
    options: ["No Onion", "No Chili", "No Garlic"],
  },
];

export default function CustomizationModal({
  isOpen,
  item,
  onClose,
}: CustomizationModalProps) {
  const { addOrderItem } = useOrder();

  // Local state for customization
  const [quantity, setQuantity] = useState(1);
  const [selectedCustomizations, setSelectedCustomizations] = useState<
    OrderItemCustomization[]
  >([]);
  const [notes, setNotes] = useState("");

  /**
   * parsePrice - Convert price string to number
   * Handles formats like "29K" or "15K/17K"
   */
  const parsePrice = (priceStr: string): number => {
    const cleanStr = priceStr.split("/")[0].toUpperCase();
    const numeric = cleanStr.replace(/[^0-9]/g, "");
    return parseInt(numeric) * 1000 || 0;
  };

  /**
   * Calculate total price including customizations
   */
  const calculateTotalPrice = (): number => {
    if (!item) return 0;
    const basePrice = parsePrice(item.price) * quantity;
    const customizationPrice = selectedCustomizations.reduce(
      (acc, custom) => acc + (custom.price || 0) * quantity,
      0
    );
    return basePrice + customizationPrice;
  };

  /**
   * Handle customization toggle
   * Add or remove customization option
   */
  const handleCustomizationChange = (
    categoryId: string,
    optionLabel: string
  ) => {
    setSelectedCustomizations((prev) => {
      const exists = prev.find(
        (c) => c.id === `${categoryId}_${optionLabel}`
      );

      // Extract price if option has it (e.g., "Extra Prawn (+5K)")
      let price = 0;
      const priceMatch = optionLabel.match(/\([\+\-](\d+)K\)/);
      if (priceMatch) {
        price = parseInt(priceMatch[1]) * 1000;
      }

      if (exists) {
        // Remove if already selected
        return prev.filter((c) => c.id !== `${categoryId}_${optionLabel}`);
      } else {
        // Add new customization
        return [
          ...prev,
          {
            id: `${categoryId}_${optionLabel}`,
            label: categoryId,
            value: optionLabel,
            price,
          },
        ];
      }
    });
  };

  /**
   * Handle confirm - add item to order
   */
  const handleConfirm = () => {
    if (!item) return;

    addOrderItem({
      menuItemName: item.name,
      menuItemPrice: item.price,
      quantity,
      customizations: selectedCustomizations,
      notes: notes.trim() || undefined,
    });

    // Reset state and close modal
    setQuantity(1);
    setSelectedCustomizations([]);
    setNotes("");
    onClose();
  };

  if (!isOpen || !item) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 pointer-events-none">
        <div
          className="bg-[#1A1A1A] rounded-2xl sm:rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl pointer-events-auto border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-[#1A1A1A] border-b border-white/10 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
            <h2 className="text-white text-lg sm:text-xl font-bold uppercase tracking-wider">
              Customize Order
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1 flex-shrink-0"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
            {/* Item Summary */}
            <div className="border-b border-white/10 pb-4 sm:pb-6">
              <h3 className="text-white text-base sm:text-lg font-bold uppercase mb-1 sm:mb-2 line-clamp-2">
                {item.name}
              </h3>
              {item.description && (
                <p className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-4">{item.description}</p>
              )}
              <p className="text-secondary-gold text-xl sm:text-2xl font-bold">
                {item.price}
              </p>
            </div>

            {/* Quantity Selector */}
            <div>
              <label className="text-white text-sm font-bold uppercase tracking-widest mb-3 block">
                Quantity
              </label>
              <div className="flex items-center gap-2 sm:gap-4 bg-[#111111] rounded-xl sm:rounded-2xl w-fit p-1.5 sm:p-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="bg-primary-brown text-white p-2 rounded-lg hover:bg-opacity-80 transition-all"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </button>
                <span className="text-white text-lg sm:text-xl font-bold min-w-10 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="bg-primary-brown text-white p-2 rounded-lg hover:bg-opacity-80 transition-all"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </button>
              </div>
            </div>

            {/* Customization Options */}
            <div>
              <label className="text-white text-xs sm:text-sm font-bold uppercase tracking-widest mb-3 sm:mb-4 block">
                Customizations
              </label>
              <div className="space-y-3 sm:space-y-4">
                {DEFAULT_CUSTOMIZATIONS.map((category) => (
                  <div key={category.id} className="bg-[#111111] rounded-xl sm:rounded-2xl p-3 sm:p-4">
                    <p className="text-secondary-gold text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2 sm:mb-3">
                      {category.label}
                    </p>
                    <div className="space-y-2">
                      {category.options.map((option) => (
                        <label
                          key={`${category.id}_${option}`}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCustomizations.some(
                              (c) =>
                                c.id === `${category.id}_${option}`
                            )}
                            onChange={() =>
                              handleCustomizationChange(category.id, option)
                            }
                            className="w-4 h-4 accent-primary-brown cursor-pointer flex-shrink-0"
                          />
                          <span className="text-white text-xs sm:text-sm group-hover:text-secondary-gold transition-colors">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Notes / Instructions */}
            <div>
              <label className="text-white text-xs sm:text-sm font-bold uppercase tracking-widest mb-2 sm:mb-3 block">
                Special Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., 'No onion, extra spicy, no sesame'"
                className="w-full bg-[#111111] text-white rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 border border-white/10 focus:border-primary-brown focus:outline-none transition-colors resize-none placeholder-gray-600 text-sm"
                rows={3}
              />
            </div>

            {/* Total Price Preview */}
            <div className="border-t border-white/10 pt-3 sm:pt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-xs sm:text-sm">Total Price:</span>
                <span className="text-secondary-gold text-xl sm:text-2xl font-bold">
                  {(calculateTotalPrice() / 1000).toFixed(0)}K
                </span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-[#1A1A1A] border-t border-white/10 px-4 sm:px-6 py-3 sm:py-4 flex gap-2 sm:gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-[#333333] text-white py-2.5 sm:py-3 rounded-lg sm:rounded-2xl font-bold text-sm sm:text-base hover:bg-opacity-80 transition-all uppercase tracking-wider"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 bg-primary-brown text-white py-2.5 sm:py-3 rounded-lg sm:rounded-2xl font-bold text-sm sm:text-base hover:bg-opacity-80 transition-all uppercase tracking-wider"
            >
              Add to Order
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
