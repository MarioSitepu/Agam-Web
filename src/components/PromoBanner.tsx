"use client";

import { ShoppingBag } from "lucide-react";

export default function PromoBanner() {
  return (
    <div className="bg-cream py-12 md:py-20 px-6 md:px-8 relative overflow-hidden group">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 md:gap-8 relative z-10 text-center md:text-left">
        <div className="flex flex-col">
          <h2 className="text-primary-brown font-script text-5xl sm:text-7xl md:text-8xl mb-2">20% Off</h2>
          <p className="text-black text-xl md:text-2xl font-bold tracking-[0.2em] md:tracking-widest uppercase">Your First Order</p>
        </div>
        
        <button className="w-full md:w-auto bg-primary-brown text-white px-10 md:px-12 py-4 md:py-5 rounded-full text-xl md:text-2xl font-bold shadow-2xl hover:bg-opacity-90 transition-all transform hover:scale-105 flex items-center justify-center gap-4 active:scale-95">
          <ShoppingBag size={24} className="md:w-7 md:h-7" />
          Shop Now
        </button>
      </div>

      {/* Decorative text watermark */}
      <span className="absolute -bottom-10 right-0 text-[200px] leading-none text-black/5 font-black uppercase pointer-events-none select-none">
        Sale
      </span>
    </div>
  );
}
