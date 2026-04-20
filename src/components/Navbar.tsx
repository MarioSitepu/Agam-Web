"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ShoppingBag, Search, LogIn, ChevronRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { menuData } from "@/data/menuData";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [activeCategory, setActiveCategory] = useState(menuData[0].id);
  const { totalCount } = useCart();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowMegaMenu(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowMegaMenu(false);
    }, 300);
  };

  const activeCategoryData = menuData.find(cat => cat.id === activeCategory);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#111111] py-5 px-6 lg:px-12 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3 relative z-20">
          <div className="w-8 h-8 rounded-full bg-[#FFB800] flex items-center justify-center">
             <span className="text-black font-bold text-lg leading-none mt-1">W</span>
          </div>
          <div className="flex items-center">
            <span className="text-xl md:text-2xl font-bold text-white uppercase tracking-wider font-sans">
              WARKOP <span className="text-[#FFB800] italic font-script ml-1 normal-case tracking-normal text-2xl md:text-3xl">Agam</span>
            </span>
          </div>
        </Link>

        {/* Center Menu (Desktop) */}
        <div className="hidden lg:flex items-center space-x-12 absolute left-1/2 -translate-x-1/2">
          <Link 
            href="/" 
            className="text-base font-medium transition-colors text-white"
          >
            Home
          </Link>

          <Link 
            href="/order" 
            className="text-base font-medium transition-colors text-gray-400 hover:text-white"
          >
            Order
          </Link>
          
          {/* Menu with MegaMenu Trigger */}
          <div 
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button 
              className="text-base font-medium transition-colors text-gray-400 hover:text-white flex items-center gap-1 py-4"
            >
              Menu
            </button>

            {/* Desktop Mega Menu */}
            <div className={`
              fixed top-[80px] left-0 right-0 bg-[#1A1A1A] border-t border-white/10 shadow-2xl transition-all duration-300 overflow-hidden
              ${showMegaMenu ? "opacity-100 translate-y-0 pointer-events-auto max-h-[600px]" : "opacity-0 -translate-y-4 pointer-events-none max-h-0"}
            `}>
              <div className="max-w-7xl mx-auto grid grid-cols-4 h-full min-h-[400px]">
                {/* Categories List */}
                <div className="col-span-1 border-r border-white/5 py-8 pr-4">
                  {menuData.map((cat) => (
                    <button
                      key={cat.id}
                      onMouseEnter={() => setActiveCategory(cat.id)}
                      className={`w-full text-left px-6 py-3 rounded-xl transition-all flex items-center justify-between group ${
                        activeCategory === cat.id ? "bg-[#FFB800] text-black font-bold" : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {cat.name}
                      <ChevronRight size={16} className={`${activeCategory === cat.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity`} />
                    </button>
                  ))}
                </div>

                {/* Items Grid with Images */}
                <div className="col-span-3 p-8 overflow-y-auto max-h-[500px] scrollbar-thin scrollbar-thumb-white/10">
                  <div className="grid grid-cols-3 gap-6">
                    {activeCategoryData?.items.map((item, idx) => (
                      <div key={idx} className="group cursor-pointer">
                        <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-[#333333]">
                          <Image 
                            src={item.image || "/placeholder-food.png"} 
                            alt={item.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                        </div>
                        <h4 className="text-white font-bold text-sm uppercase tracking-tight group-hover:text-[#FFB800] transition-colors">{item.name}</h4>
                        <p className="text-[#FFB800] font-bold text-xs">{item.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {["Promo", "About"].map((item) => (
            <Link 
              key={item} 
              href={`/${item.toLowerCase()}`} 
              className="text-base font-medium transition-colors text-gray-400 hover:text-white"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Right Section (Actions) */}
        <div className="hidden lg:flex items-center gap-6 relative z-20">
          <button className="text-white hover:text-[#FFB800] transition-colors">
            <Search size={20} />
          </button>
          
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative text-white hover:text-[#FFB800] transition-colors"
          >
            <ShoppingBag size={20} />
            {totalCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#FFB800] text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {totalCount}
              </span>
            )}
          </button>

          <button className="flex items-center gap-2 border border-[#FFB800] px-6 py-2 rounded-full text-white hover:bg-[#FFB800] hover:text-black transition-all group">
            <span className="text-sm font-medium">Login</span>
            <LogIn size={16} className="text-[#FFB800] group-hover:text-black" />
          </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden text-white p-2 relative z-20"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <div className={`
        lg:hidden absolute top-full left-0 right-0 bg-[#111111] border-t border-white/10 shadow-2xl transition-all duration-300 ease-in-out
        ${isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-4 pointer-events-none"}
      `}>
        <div className="flex flex-col p-6 space-y-4 overflow-y-auto max-h-[80vh]">
          <Link href="/" className="text-white text-xl font-bold" onClick={() => setIsOpen(false)}>Home</Link>
          
          <Link href="/order" className="text-white text-xl font-bold hover:text-[#FFB800] transition-colors" onClick={() => setIsOpen(false)}>Order</Link>
          
          <div className="pt-2 border-t border-white/5">
             <p className="text-[#FFB800] text-sm font-bold mb-4 uppercase tracking-widest">Our Menus</p>
             <div className="grid grid-cols-2 gap-4">
                {menuData.slice(0, 4).map((cat) => (
                  <Link 
                    key={cat.id} 
                    href="#menu" 
                    className="flex flex-col gap-2 group"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-[#333333]">
                       <Image src={cat.items[0]?.image || "/placeholder-food.png"} alt={cat.name} fill className="object-cover" />
                    </div>
                    <span className="text-white text-xs font-bold uppercase">{cat.name}</span>
                  </Link>
                ))}
             </div>
          </div>

          {["Promo", "About"].map((item) => (
            <Link 
              key={item} 
              href={`/${item.toLowerCase()}`} 
              className="text-white text-xl font-bold hover:text-[#FFB800] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {item}
            </Link>
          ))}
          
          <div className="flex items-center gap-6 pt-6 border-t border-white/10">
            <button className="text-white flex items-center gap-2" onClick={() => { setIsCartOpen(true); setIsOpen(false); }}>
              <ShoppingBag size={20} /> 
              <span>Cart ({totalCount})</span>
            </button>
            <button className="text-[#FFB800] flex items-center gap-2" onClick={() => setIsOpen(false)}>
              <LogIn size={20} />
              <span>Login</span>
            </button>
          </div>
        </div>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  );
}
