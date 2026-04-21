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
  // 2-seat tables
  { id: "table-1", label: "Table 1", seats: 2 },
  { id: "table-2", label: "Table 2", seats: 2 },
  { id: "table-3", label: "Table 3", seats: 2 },
  { id: "table-4", label: "Table 4", seats: 2 },
  { id: "table-5", label: "Table 5", seats: 2 },
  { id: "table-6", label: "Table 6", seats: 2 },
  // 4-seat tables
  { id: "table-7", label: "Table 7", seats: 4 },
  { id: "table-8", label: "Table 8", seats: 4 },
  { id: "table-9", label: "Table 9", seats: 4 },
  { id: "table-10", label: "Table 10", seats: 4 },
  { id: "table-11", label: "Table 11", seats: 4 },
  { id: "table-12", label: "Table 12", seats: 4 },
  // 6-seat tables
  { id: "table-13", label: "Table 13", seats: 6 },
  { id: "table-14", label: "Table 14", seats: 6 },
  { id: "table-15", label: "Table 15", seats: 6 },
  { id: "table-16", label: "Table 16", seats: 6 },
  { id: "table-17", label: "Table 17", seats: 6 },
  { id: "table-18", label: "Table 18", seats: 6 },
  // 8-seat tables
  { id: "table-19", label: "Table 19", seats: 8 },
  { id: "table-20", label: "Table 20", seats: 8 },
  { id: "table-21", label: "Table 21", seats: 8 },
  { id: "table-22", label: "Table 22", seats: 8 },
  { id: "table-23", label: "Table 23", seats: 8 },
];

export default function TableSelector() {
  return (
    <div className="min-h-screen bg-white pt-16 sm:pt-20 pb-6 sm:pb-8 px-4 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-black font-script text-3xl sm:text-4xl md:text-5xl mb-1 sm:mb-2">
            Select Table
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm px-2">
            Choose your table to start ordering
          </p>
        </div>

        {/* Table Selection Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {AVAILABLE_TABLES.map((table) => (
            <Link
              key={table.id}
              href={`/order/${table.id}`}
              className="group relative overflow-hidden"
            >
              {/* Table Card */}
              <div className="bg-bg-dark rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-white/10 hover:border-primary-brown/50 transition-all duration-300 flex flex-col items-center justify-center text-center hover:shadow-lg hover:shadow-primary-brown/20">
                {/* QR Code Icon */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg bg-primary-brown/20 flex items-center justify-center mb-2 sm:mb-3 group-hover:bg-primary-brown/30 transition-colors">
                  <QrCode
                    className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-primary-brown group-hover:text-primary-brown transition-colors"
                  />
                </div>

                {/* Table Label */}
                <h2 className="text-white text-lg sm:text-xl md:text-2xl font-bold uppercase tracking-wide mb-1">
                  {table.label}
                </h2>

                {/* Seats Info */}
                <p className="text-secondary-gold text-xs sm:text-sm font-semibold mb-2 sm:mb-3">
                  {table.seats} seats
                </p>

                {/* Bottom: Arrow indicator */}
                <div className="flex items-center gap-1 text-secondary-gold group-hover:gap-2 transition-all">
                  <span className="text-xs font-bold uppercase tracking-wide">
                    Order
                  </span>
                  <ArrowRight
                    className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                  />
                </div>
              </div>

              {/* Hover Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-brown/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
            </Link>
          ))}
        </div>

        {/* Info Text */}
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-gray-600 text-xs sm:text-sm px-4">
            💡 Or scan the QR code on your table to order directly
          </p>
        </div>
      </div>
    </div>
  );
}
