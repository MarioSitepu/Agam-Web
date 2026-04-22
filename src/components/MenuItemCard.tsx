"use client";

import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { MenuItem } from "@/data/menuData";

/**
 * MenuItemCard - Reusable component for displaying menu items
 *
 * Props:
 * - item: MenuItem object with name, price, description, image
 * - onOrderClick: Callback when "Order" button is clicked (to open customization modal)
 * - isLoading: Optional loading state for async actions
 *
 * Design Notes:
 * - Matches ProductGrid styling (dark bg, rounded corners, image hover effect)
 * - Uses consistent colors from design system: primary-brown, secondary-gold, bg-dark
 * - Responsive font sizes and spacing for mobile/desktop
 * - Hover effects on image and button for better interaction feedback
 */

interface MenuItemCardProps {
  item: MenuItem;
  onOrderClick: (item: MenuItem) => void;
  isLoading?: boolean;
}

export default function MenuItemCard({
  item,
  onOrderClick,
  isLoading = false,
}: MenuItemCardProps) {
  return (
    <div className="bg-bg-dark rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 flex flex-col items-start group relative h-full transition-all hover:shadow-2xl hover:shadow-primary-brown/10">
      {/* Image Container - Consistent with ProductGrid styling */}
      <div className="relative w-full aspect-square mb-3 sm:mb-4 md:mb-6 overflow-hidden rounded-xl sm:rounded-2xl">
        <Image
          src={item.image || "/placeholder-food.png"}
          alt={item.name}
          fill
          className="object-cover transition-transform group-hover:scale-110 duration-500"
          priority={false}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {/* Content Section */}
      <div className="flex-1 w-full flex flex-col">
        {/* Menu Item Name */}
        <h3 className="text-white text-base sm:text-lg md:text-xl font-bold uppercase tracking-wide sm:tracking-wider mb-2 line-clamp-2">
          {item.name}
        </h3>

        {/* Description (if available) */}
        {item.description && (
          <p className="text-gray-400 text-xs md:text-sm mb-2 sm:mb-3 line-clamp-2 flex-grow">
            {item.description}
          </p>
        )}

        {/* Footer: Price and Button */}
        <div className="w-full flex justify-between items-end gap-2 sm:gap-3 pt-2 border-t border-white/10">
          {/* Price Display */}
          <div className="flex flex-col">
            <span className="text-secondary-gold text-lg sm:text-xl md:text-2xl font-bold">
              {item.price}
            </span>
          </div>

          {/* Order Button */}
          <button
            onClick={() => onOrderClick(item)}
            disabled={isLoading}
            className="bg-primary-brown text-white p-2.5 sm:p-3 md:p-4 rounded-full shadow-lg hover:bg-opacity-80 transition-all flex items-center justify-center active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
            aria-label={`Add ${item.name} to order`}
            title={`Order ${item.name}`}
          >
            <ShoppingCart
              className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover/btn:rotate-12 transition-transform"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
