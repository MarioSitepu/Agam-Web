"use client";

import { useState } from "react";
import Image from "next/image";
import { menuData } from "@/data/menuData";
import { Plus, Flame, Star } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function ExploreSection() {
  const [activeTab, setActiveTab] = useState(menuData[0].id);
  const activeCategory = menuData.find((cat) => cat.id === activeTab);
  const { addItem } = useCart();

  return (
    <section id="menu" className="bg-white py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-10 md:mb-16">
          <h4 className="text-primary-brown uppercase tracking-[0.2em] sm:tracking-[0.3em] font-bold text-xs sm:text-sm mb-3 sm:mb-4">Our Recommendation</h4>
          <h2 className="text-black font-script text-5xl sm:text-6xl md:text-8xl text-center">Makan & Minum</h2>
        </div>
        
        {/* Category Tabs */}
        <div className="flex items-center lg:justify-center gap-4 sm:gap-6 md:gap-10 mb-10 sm:mb-12 md:mb-16 border-b border-gray-100 pb-4 sm:pb-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {menuData.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`text-base sm:text-lg md:text-xl font-bold transition-all relative pb-2 px-2 uppercase tracking-tight ${
                activeTab === cat.id ? "text-primary-brown scale-105" : "text-gray-400 hover:text-black"
              }`}
            >
              {cat.name}
              {activeTab === cat.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-brown rounded-full"></div>
              )}
            </button>
          ))}
        </div>
        
        {/* Menu Items Grid - IMAGE BASED */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
          {activeCategory?.items.map((item, index) => (
            <div 
              key={index} 
              className="bg-gray-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col group relative transition-all hover:bg-white hover:shadow-2xl hover:shadow-primary-brown/10 border border-transparent hover:border-primary-brown/5"
            >
              {/* Product Image */}
              <div className="relative w-full aspect-square mb-4 sm:mb-6 overflow-hidden rounded-xl sm:rounded-[2rem] shadow-lg">
                <Image
                  src={item.image || "/placeholder-food.png"}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay Badge for Featured */}
                {item.isFeatured && (
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-[#FFB800] text-black text-[8px] sm:text-[10px] font-black px-2 sm:px-3 py-1 rounded-full uppercase flex items-center gap-1 shadow-lg z-10">
                     <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-black" />
                     <span>Best Seller</span>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              {/* Product Info */}
              <div className="w-full flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                   <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-primary-brown transition-colors uppercase leading-[1.2] max-w-[80%]">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-0.5 text-[#FFB800]">
                    <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#FFB800]" />
                    <span className="text-xs font-bold text-gray-600">4.8</span>
                  </div>
                </div>
                
                {item.description && (
                  <p className="text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{item.description}</p>
                )}
                
                <div className="mt-auto flex justify-between items-center pt-3 sm:pt-4 border-t border-gray-100 group-hover:border-primary-brown/20 transition-colors gap-3">
                  <span className="text-lg sm:text-2xl font-black text-gray-900 bg-primary-brown/5 px-2 sm:px-4 py-1 rounded-xl">
                    {item.price}
                  </span>
                  
                  <button
                    onClick={() => addItem({ name: item.name, price: item.price })}
                    className="bg-primary-brown text-white w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl shadow-xl shadow-primary-brown/20 hover:scale-110 active:scale-95 transition-all flex items-center justify-center group/add flex-shrink-0"
                    aria-label={`Add ${item.name} to cart`}
                  >
                    <Plus className="w-6 h-6 sm:w-6 sm:h-6 group-hover/add:rotate-90 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
