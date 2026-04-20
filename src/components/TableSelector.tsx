"use client";

import Link from "next/link";
import { QrCode, ArrowRight } from "lucide-react";

/**
 * TableSelector - Component to select dining table before ordering
 *
 * Displays available tables for customer to choose from.
 * Each table card shows table ID and has a link to the order page.
 *
 * Features:
 * - Grid layout of available tables
 * - QR code icon for visual consistency
 * - Click to navigate to order page with table ID
 * - Responsive design (1-2 cols mobile, 2-3 cols desktop)
 *
 * Future Enhancement:
 * - Integrate QR code scanning to auto-detect table
 * - Real-time table availability status
 * - Table capacity indicators
 * - Reservation system integration
 */

export const AVAILABLE_TABLES = [
  { id: "table-1", label: "Table 1", seats: 4 },
  { id: "table-2", label: "Table 2", seats: 4 },
  // Add more tables as needed
];

export default function TableSelector() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-black font-script text-5xl md:text-6xl mb-3">
            Select Table
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Choose your table to start ordering
          </p>
        </div>

        {/* Table Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 md:gap-8">
          {AVAILABLE_TABLES.map((table) => (
            <Link
              key={table.id}
              href={`/order/${table.id}`}
              className="group relative overflow-hidden"
            >
              {/* Table Card */}
              <div className="bg-bg-dark rounded-3xl p-8 md:p-10 border border-white/10 hover:border-primary-brown/50 transition-all duration-300 flex flex-col items-center justify-center text-center h-full hover:shadow-2xl hover:shadow-primary-brown/20">
                {/* QR Code Icon */}
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary-brown/20 flex items-center justify-center mb-6 group-hover:bg-primary-brown/30 transition-colors">
                  <QrCode
                    size={32}
                    className="md:w-10 md:h-10 text-primary-brown group-hover:text-primary-brown transition-colors"
                  />
                </div>

                {/* Table Label */}
                <h2 className="text-white text-3xl md:text-4xl font-bold uppercase tracking-wider mb-2">
                  {table.label}
                </h2>

                {/* Seats Info */}
                <p className="text-secondary-gold text-sm md:text-base font-semibold mb-6">
                  Seats for {table.seats}
                </p>

                {/* Bottom: Arrow indicator */}
                <div className="mt-auto pt-4 flex items-center gap-2 text-secondary-gold group-hover:gap-3 transition-all">
                  <span className="text-xs md:text-sm font-bold uppercase tracking-wider">
                    Order Now
                  </span>
                  <ArrowRight
                    size={20}
                    className="md:w-5 md:h-5 group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </div>

              {/* Hover Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-brown/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none" />
            </Link>
          ))}
        </div>

        {/* Info Text */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 text-xs md:text-sm px-4">
            💡 Or scan the QR code on your table to order directly
          </p>
        </div>
      </div>
    </div>
  );
}
