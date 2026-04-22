"use client";

import { ArrowRight, Mail, Globe, Camera, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="pt-16 sm:pt-20 pb-8 sm:pb-10 px-4 sm:px-6 md:px-8 border-t border-white/10 bg-bg-dark text-white relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 text-center sm:text-left">
        <div className="flex flex-col items-center sm:items-start">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-[#FFB800] flex items-center justify-center">
              <span className="text-black font-bold text-lg leading-none mt-1">W</span>
            </div>
            <span className="text-2xl font-bold text-white uppercase tracking-wider">
              WARKOP <span className="text-[#FFB800] italic font-script ml-1 normal-case tracking-normal text-3xl">Agam</span>
            </span>
          </div>
          <p className="text-white/60 mb-6 sm:mb-8 leading-relaxed max-w-sm sm:max-w-none text-sm sm:text-base">
            The Authentic Medan Concept. Menghadirkan cita rasa otentik Mie Aceh, 
            Kopi Sanger, dan kuliner khas Medan dengan bumbu rempah pilihan.
          </p>
          <div className="flex gap-3 sm:gap-4 justify-center sm:justify-start">
            <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
              <Globe className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
              <Camera className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
              <Send className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </a>
          </div>
        </div>

        <div className="sm:pl-10 lg:pl-0 text-center sm:text-left">
          <h4 className="text-white font-medium mb-4 sm:mb-6 uppercase tracking-wider text-xs sm:text-sm">Quick Links</h4>
          <ul className="space-y-4">
            <li><a href="#" className="text-white/60 hover:text-secondary-gold transition-colors text-sm">Home</a></li>
            <li><a href="#" className="text-white/60 hover:text-secondary-gold transition-colors text-sm">Products</a></li>
            <li><a href="#" className="text-white/60 hover:text-secondary-gold transition-colors text-sm">About Us</a></li>
            <li><a href="#" className="text-white/60 hover:text-secondary-gold transition-colors text-sm">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-medium mb-4 sm:mb-6 uppercase tracking-wider text-xs sm:text-sm">Our Specialties</h4>
          <ul className="space-y-3 sm:space-y-4">
            <li><a href="#" className="text-white/60 hover:text-secondary-gold transition-colors text-sm">Mie Aceh Spesial</a></li>
            <li><a href="#" className="text-white/60 hover:text-secondary-gold transition-colors text-sm">Nasi Gurih Medan</a></li>
            <li><a href="#" className="text-white/60 hover:text-secondary-gold transition-colors text-sm">Kopi Sanger</a></li>
            <li><a href="#" className="text-white/60 hover:text-secondary-gold transition-colors text-sm">Teh Tarek</a></li>
          </ul>
        </div>

        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <h4 className="text-white font-medium mb-4 sm:mb-6 uppercase tracking-wider text-xs sm:text-sm">Newsletter</h4>
          <p className="text-white/60 mb-4 sm:mb-6 text-xs sm:text-sm">Subscribe to get special offers and seasonal news.</p>
          <div className="flex w-full gap-2 max-w-sm">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4 sm:w-4 sm:h-4" />
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full bg-white/5 border border-white/10 rounded-full py-2 sm:py-2.5 pl-9 sm:pl-10 pr-3 sm:pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-secondary-gold transition-colors text-xs sm:text-sm"
              />
            </div>
            <button className="bg-secondary-gold text-black p-2 sm:p-2.5 rounded-full hover:bg-secondary-gold/80 transition-all group flex-shrink-0">
              <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 sm:mt-20 pt-6 sm:pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
        <p className="text-white/40 text-xs text-center md:text-left">
          © 2024 Warkop Agam. All rights reserved. Authentic Taste of Medan.
        </p>
        <div className="flex gap-4 sm:gap-6 md:gap-8">
          <a href="#" className="text-white/40 text-xs hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="text-white/40 text-xs hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>

      {/* Decorative text watermark */}
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[100px] xs:text-[150px] md:text-[300px] leading-none text-white/[0.02] font-black uppercase pointer-events-none select-none z-[-1]">
        Agam
      </span>
    </footer>
  );
}
