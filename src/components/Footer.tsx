"use client";

import { ArrowRight, Mail, Globe, Camera, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="pt-20 pb-10 px-6 md:px-8 border-t border-white/10 bg-bg-dark text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center sm:text-left">
        <div className="flex flex-col items-center sm:items-start">
          <h2 className="text-3xl font-script text-white mb-6">Bakery</h2>
          <p className="text-white/60 mb-8 leading-relaxed max-w-sm sm:max-w-none">
            Crafting moments of joy with every bite. Our bakery brings you the 
            finest artisanal breads and pastries, made with love and premium ingredients.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
              <Globe size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
              <Camera size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
              <Send size={18} />
            </a>
          </div>
        </div>

        <div className="sm:pl-10 lg:pl-0">
          <h4 className="text-white font-medium mb-6 uppercase tracking-wider text-sm">Quick Links</h4>
          <ul className="space-y-4">
            <li><a href="#" className="text-white/60 hover:text-secondary-gold transition-colors">Home</a></li>
            <li><a href="#" className="text-white/60 hover:text-secondary-gold transition-colors">Products</a></li>
            <li><a href="#" className="text-white/60 hover:text-secondary-gold transition-colors">About Us</a></li>
            <li><a href="#" className="text-white/60 hover:text-secondary-gold transition-colors">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-medium mb-6 uppercase tracking-wider text-sm">Products</h4>
          <ul className="space-y-4">
            <li><a href="#" className="text-white/60 hover:text-secondary-gold transition-colors">Artisanal Bread</a></li>
            <li><a href="#" className="text-white/60 hover:text-secondary-gold transition-colors">Custom Cakes</a></li>
            <li><a href="#" className="text-white/60 hover:text-secondary-gold transition-colors">French Pastries</a></li>
            <li><a href="#" className="text-white/60 hover:text-secondary-gold transition-colors">Seasonal Specials</a></li>
          </ul>
        </div>

        <div className="flex flex-col items-center sm:items-start">
          <h4 className="text-white font-medium mb-6 uppercase tracking-wider text-sm">Newsletter</h4>
          <p className="text-white/60 mb-6 text-sm">Subscribe to get special offers and seasonal news.</p>
          <div className="flex w-full gap-2 max-w-sm sm:max-w-none">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-secondary-gold transition-colors text-sm"
              />
            </div>
            <button className="bg-secondary-gold text-black p-2.5 rounded-full hover:bg-secondary-gold/80 transition-all group">
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-white/40 text-xs text-center md:text-left">
          © 2024 Bakery Delight. All rights reserved. Made with love for artisanal baking.
        </p>
        <div className="flex gap-6 md:gap-8">
          <a href="#" className="text-white/40 text-xs hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="text-white/40 text-xs hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>

      {/* Decorative text watermark */}
      <span className="absolute -bottom-20 -left-10 text-[300px] leading-none text-white/5 font-black uppercase pointer-events-none select-none z-[-1]">
        Bake
      </span>
    </footer>
  );
}
