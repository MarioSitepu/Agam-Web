"use client";

import { useState } from "react";
import { QrCode } from "lucide-react";

/**
 * QRTokenInput - Input field for QR code scanning or token entry
 *
 * Props:
 * - value: Current input value
 * - onChange: Callback when input changes
 * - placeholder: Input placeholder text
 * - disabled: Disable input state
 * - onScan: Optional callback for scan action button (future: web camera API)
 *
 * Design:
 * - Clean input field with QR icon
 * - Optional scan button for future camera integration
 * - Clear labeling and instructions
 * - Responsive sizing
 *
 * Future Enhancement:
 * - Integrate web camera API for QR scanning
 * - Add scan progress indicator
 * - Support multiple scanning methods
 */

interface QRTokenInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  onScan?: () => void;
}

export default function QRTokenInput({
  value,
  onChange,
  placeholder = "Scan QR or enter token...",
  disabled = false,
  onScan,
}: QRTokenInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-dashed border-white/20 hover:border-secondary-gold/30 transition-colors">
      {/* Label */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 rounded-full bg-secondary-gold/20 flex items-center justify-center">
          <QrCode size={14} className="text-secondary-gold" />
        </div>
        <p className="text-secondary-gold text-xs font-bold uppercase tracking-wider">
          QR Token / Order ID
        </p>
      </div>

      {/* Input Container */}
      <div className="flex gap-2 items-stretch">
        {/* Input Field */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          className={`flex-1 bg-[#111111] border rounded-lg px-3 py-2 text-white text-xs md:text-sm placeholder-gray-600 focus:outline-none transition-all ${
            isFocused
              ? "border-secondary-gold bg-[#111111]"
              : "border-white/10 hover:border-white/20"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        />

        {/* Scan Button (Future: Camera Integration) */}
        {onScan && (
          <button
            onClick={onScan}
            disabled={disabled}
            className="bg-secondary-gold/20 hover:bg-secondary-gold/30 text-secondary-gold rounded-lg px-3 py-2 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            title="Scan QR code (coming soon)"
            aria-label="Scan QR code"
          >
            <QrCode size={18} />
          </button>
        )}
      </div>

      {/* Helper Text */}
      <p className="text-gray-500 text-[10px] md:text-[11px] mt-2 leading-relaxed">
        💡 Optional: Scan table QR code for order tracking & payment integration
      </p>
    </div>
  );
}
